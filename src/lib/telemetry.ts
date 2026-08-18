import * as fs from 'fs'
import * as path from 'path'

// Telemetry event schema - all events must conform to this structure
export interface TelemetryEvent {
  timestamp: string
  level: 'debug' | 'info' | 'warn' | 'error'
  category: 'pipeline' | 'inference' | 'pdf' | 'error'
  event: string
  metadata: Record<string, unknown>
}

// Telemetry logger - singleton pattern for structured logging
class TelemetryLogger {
  private static instance: TelemetryLogger
  private readonly logDir: string
  private readonly logFile: string
  private readonly maxFileSize: number = 10 * 1024 * 1024 // 10MB
  private enabled: boolean
  private currentRunId: string | null = null
  private currentConfig: Record<string, unknown> | null = null

  private constructor() {
    // If DSST_TELEMETRY_FILE is set, write directly to that path (e.g., into a benchmark run folder).
    // Otherwise fall back to the default global log at ~/Library/Logs/DSST/dsst_structured.jsonl
    const customFile = process.env.DSST_TELEMETRY_FILE
    if (customFile) {
      this.logFile = customFile.startsWith('/') ? customFile : path.join(process.cwd(), customFile)
      this.logDir = path.dirname(this.logFile)
    } else {
      this.logDir = path.join(process.env.HOME || '', 'Library', 'Logs', 'DSST')
      this.logFile = path.join(this.logDir, 'dsst_structured.jsonl')
    }
    this.enabled = process.env.DSST_TELEMETRY_ENABLED === 'true'

    // If DSST_RUN_ID is set, tag every event with it
    if (process.env.DSST_RUN_ID) {
      this.currentRunId = process.env.DSST_RUN_ID
    }

    // Ensure log directory exists — only when telemetry is enabled and guard
    // against read-only filesystems (e.g. Vercel serverless functions).
    if (this.enabled) {
      try {
        if (!fs.existsSync(this.logDir)) {
          fs.mkdirSync(this.logDir, { recursive: true })
        }
      } catch (err) {
        console.warn('[telemetry] Cannot create log directory, disabling telemetry:', err)
        this.enabled = false
      }
    }
  }

  static getInstance(): TelemetryLogger {
    if (!TelemetryLogger.instance) {
      TelemetryLogger.instance = new TelemetryLogger()
    }
    return TelemetryLogger.instance
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  isEnabled(): boolean {
    return this.enabled
  }

  // Set the run identifier for benchmark tracking.
  // When non-null, every emitted event gets a `run_id` metadata field.
  setRunId(runId: string | null): void {
    this.currentRunId = runId
  }

  getRunId(): string | null {
    return this.currentRunId
  }

  // Set run-level configuration snapshot (provider, model, thinking_budgets, etc.)
  // This gets injected into every event in the run.
  setRunConfig(config: Record<string, unknown> | null): void {
    this.currentConfig = config
  }

  // Rotate log file if it exceeds max size
  private rotateIfNeeded(): void {
    if (!fs.existsSync(this.logFile)) return

    const stats = fs.statSync(this.logFile)
    if (stats.size < this.maxFileSize) return

    // Rotate: backup -> backup.1, current -> backup
    const backupFile = `${this.logFile}.1`

    if (fs.existsSync(backupFile)) {
      fs.unlinkSync(backupFile)
    }

    if (fs.existsSync(this.logFile)) {
      fs.renameSync(this.logFile, backupFile)
    }
  }

  // Write a single event to the log file. Automatically injects run_id and config.
  private write(event: TelemetryEvent): void {
    if (!this.enabled) return

    try {
      this.rotateIfNeeded()
      const enriched = {
        ...event,
        metadata: {
          ...event.metadata,
          ...(this.currentConfig || {}),
          ...(this.currentRunId ? { run_id: this.currentRunId } : {}),
        }
      }
      const line = JSON.stringify(enriched) + '\n'
      fs.appendFileSync(this.logFile, line, 'utf8')
    } catch (error) {
      console.error('Failed to write telemetry event:', error)
    }
  }

  // Convenience methods for common event types

  // Begin a pipeline run with optional configuration snapshot.
  // `config` captures model, provider, thinking_budgets, max_tokens per pass, system_prompt_hash, etc.
  logPipelineStart(lessonId: string, pdfSizeBytes: number, config?: Record<string, unknown>): void {
    if (config) {
      this.setRunConfig(config)
    }
    this.write({
      timestamp: new Date().toISOString(),
      level: 'info',
      category: 'pipeline',
      event: 'pipeline_start',
      metadata: { lesson_id: lessonId, pdf_size_bytes: pdfSizeBytes, ...(config || {}) }
    })
  }

  logPdfExtractionComplete(durationMs: number, textLength: number): void {
    this.write({
      timestamp: new Date().toISOString(),
      level: 'info',
      category: 'pdf',
      event: 'pdf_extraction_complete',
      metadata: { duration_ms: durationMs, text_length: textLength }
    })
  }

  logInferenceStart(pass: string, passName: string, config?: Record<string, unknown>): void {
    this.write({
      timestamp: new Date().toISOString(),
      level: 'info',
      category: 'inference',
      event: 'inference_start',
      metadata: { pass, pass_name: passName, ...(config || {}) }
    })
  }

  logInferenceComplete(runId: string | null, pass: string, durationMs: number, inputTokens: number, outputTokens: number, extra?: Record<string, unknown>): void {
    this.write({
      timestamp: new Date().toISOString(),
      level: 'info',
      category: 'inference',
      event: 'inference_complete',
      metadata: { ...(runId ? { run_id: runId } : {}), pass, duration_ms: durationMs, input_tokens: inputTokens, output_tokens: outputTokens, ...(extra || {}) }
    })
  }

  logInferenceError(passName: string, errorCategory: string, errorMessage: string, durationMs: number): void {
    this.write({
      timestamp: new Date().toISOString(),
      level: 'error',
      category: 'error',
      event: 'inference_error',
      metadata: {
        pass: passName,
        error_category: errorCategory,
        error_message: errorMessage,
        duration_ms: durationMs,
        ...(this.currentRunId ? { run_id: this.currentRunId } : {})
      }
    })
  }

  // Complete pipeline with optional extra metadata (provider, model snapshot, thinking_budgets used)
  logPipelineComplete(totalDurationMs: number, passCount: number, extra?: Record<string, unknown>): void {
    this.write({
      timestamp: new Date().toISOString(),
      level: 'info',
      category: 'pipeline',
      event: 'pipeline_complete',
      metadata: { total_duration_ms: totalDurationMs, pass_count: passCount, ...(extra || {}) }
    })
  }

  logPipelineError(errorCategory: string, errorMessage: string, totalDurationMs: number): void {
    this.write({
      timestamp: new Date().toISOString(),
      level: 'error',
      category: 'error',
      event: 'pipeline_error',
      metadata: {
        error_category: errorCategory,
        error_message: errorMessage,
        total_duration_ms: totalDurationMs
      }
    })
  }

  logDebug(message: string, metadata: Record<string, unknown> = {}): void {
    this.write({
      timestamp: new Date().toISOString(),
      level: 'debug',
      category: 'pipeline',
      event: 'debug',
      metadata: { message, ...metadata }
    })
  }
}

// Export singleton instance for use throughout the app
export const telemetry = TelemetryLogger.getInstance()