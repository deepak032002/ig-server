import puppeteer, { Browser } from 'puppeteer'
import * as cheerio from 'cheerio'
// import { generateText } from '../utils/bot';
import { PrismaService } from 'src/prisma.service'
import { Injectable } from '@nestjs/common'
import { CustomWinstonLogger } from 'src/custom-winston-logger/custom-winston-logger'

@Injectable()
export class ScrapeFunctions {
  constructor(
    private loggerInstance: CustomWinstonLogger,
    private prisma: PrismaService,
  ) {}

  private browserInstance: Browser | null = null

  loadData = async (link: string) => {
    if (!this.browserInstance) {
      this.browserInstance = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox'],
      })
    }

    const page = await this.browserInstance.newPage()

    const url = link

    await page.goto(url, { timeout: 0, waitUntil: 'domcontentloaded' })
    const html = await page.content()

    const $ = cheerio.load(html)

    return $
  }

  getHinduEditorialContent = async (link: string) => {
    this.loggerInstance.getLogger().info(`Fetching editorial content from ${link}`)

    const $ = await this.loadData(link)

    return {
      title: $('.editorial .title').text().trim(),
      content: $('.editorial .articlebodycontent > p').text().trim(),
      source: link,
    }
  }

  getListOfHinduEditorials = async () => {
    this.loggerInstance.getLogger().info('Fetching hindu editorials list')
    const $ = await this.loadData('https://www.thehindu.com/opinion/editorial/')

    const links = $('.editorial-section .element.wide-row-element .title a')
      .toArray()
      .map((el) => $(el).attr('href'))

    const promise = links.map(async (link) => {
      const isFetchedLink = await this.prisma.source.findFirst({
        where: { link },
      })
      if (isFetchedLink) return []
      return this.getHinduEditorialContent(link)
    })

    const editorials = await Promise.all(promise)

    if (editorials.flat().length === 0) {
      this.loggerInstance.getLogger().info('Already fetched hindu editorials')
      return []
    }

    this.loggerInstance.getLogger().info('Saving hindu editorial list')

    const data = editorials.flat().map(async (item) => {
      await this.prisma.article.create({
        data: {
          title: item.title,
          content: item.content,
          source: {
            create: {
              link: item.source,
              title: 'The Hindu',
            },
          },
        },
      })
    })

    await Promise.all(data)

    this.loggerInstance.getLogger().info('Successfully fetched and saved hindu editorial list')
    this.browserInstance.close()
    return editorials.flat()
  }
}
