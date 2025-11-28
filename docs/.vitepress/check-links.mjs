#!/usr/bin/env node

import { checkAllLinks, generateReport } from './utils/index.mjs'

async function main() {
  console.log('🔍 开始检测断链...\n')

  try {
    const brokenLinks = checkAllLinks({ maxDepth: Infinity })
    if (brokenLinks.length === 0) {
      console.log('✅ 未发现断链！所有链接都正常。\n')
      process.exit(0)
    }

    const report = generateReport(brokenLinks)
    console.log(report)
    console.log(`\n⚠️  共发现 ${brokenLinks.length} 个断链，请修复后再继续。\n`)
    process.exit(1)
  } catch (error) {
    console.error('❌ 检测过程中发生错误:', error.message)
    process.exit(1)
  }
}

main()

