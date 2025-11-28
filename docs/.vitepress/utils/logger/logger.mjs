/**
 * 日志工具模块
 */

import { LOG_LEVEL } from '../config/index.mjs'

let currentLogLevel = LOG_LEVEL.WARN

/**
 * 设置日志级别
 * @param {number} level - 日志级别
 */
export function setLogLevel(level) {
  currentLogLevel = level
}

/**
 * 获取当前日志级别
 * @returns {number} - 当前日志级别
 */
export function getLogLevel() {
  return currentLogLevel
}

/**
 * 日志工具对象
 */
export const logger = {
  error: (msg, ...args) => {
    if (currentLogLevel >= LOG_LEVEL.ERROR) {
      console.error('❌', msg, ...args)
    }
  },
  warn: (msg, ...args) => {
    if (currentLogLevel >= LOG_LEVEL.WARN) {
      console.warn('⚠️ ', msg, ...args)
    }
  },
  info: (msg, ...args) => {
    if (currentLogLevel >= LOG_LEVEL.INFO) {
      console.info('ℹ️ ', msg, ...args)
    }
  },
  debug: (msg, ...args) => {
    if (currentLogLevel >= LOG_LEVEL.DEBUG) {
      console.log('🔍', msg, ...args)
    }
  }
}

