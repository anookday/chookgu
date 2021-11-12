import Axios from 'axios'
import cheerio from 'cheerio'
import { parse } from 'date-fns'
import { Player } from '@players/schemas/player.schema'

/**
 * Parse playerElement to get relevant player info.
 * Return gathered data as an object.
 * @param $ cheerio instance
 * @param playerElement cheerio object that holds html of relevant player data
 * @param team player's team name to be added to result
 * @return Mongoose document with relevant player data
 * @throws Will throw an error if attribute "id" is not present in playerElement
 */
function getPlayerInfo(
  $: cheerio.Root,
  playerElement: cheerio.Element,
  team: string
): Player {
  const _id = parseInt(
    $(playerElement)
      .find(
        'td:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(2) > tm-tooltip'
      )
      .attr('data-identifier') || ''
  )
  if (!_id) {
    throw new Error('attribute "id" not found in playerElement')
  }
  const name = $(playerElement)
    .find(
      'td:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(2) > tm-tooltip a:first'
    )
    .text()
    .trim()
  const position = $(playerElement)
    .find('td:nth-child(2) > table > tbody > tr:nth-child(2) > td')
    .text()
    .trim()
  let nationality: string[] = []
  $(playerElement)
    .find('td:nth-child(5) img')
    .each((_, elem) => {
      nationality.push($(elem).attr('alt') || '')
    })
  let dobStr = $(playerElement).find('td:nth-child(4)').text().trim()
  // remove the age portion of date string (eg. Apr 26, 1995 (26) -> Apr 26, 1995)
  dobStr = dobStr.split(' ').slice(0, -1).join(' ')
  const dateOfBirth = parse(dobStr, 'MMM d, yyyy', new Date())
  const image =
    $(playerElement)
      .find(
        'td:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(1) img'
      )
      .attr('data-src') || ''
  const valueStr = $(playerElement).find('td:nth-child(6)').text().trim()
  const currentValue = parsePlayerValue(valueStr)
  const value = [
    {
      date: new Date(),
      amount: currentValue,
      currency: 'EUR',
    },
  ]
  return {
    _id,
    name,
    position,
    nationality,
    dateOfBirth,
    team,
    image,
    currentValue,
    value,
  }
}

/**
 * Returns a given value string's numerical representation in Euros.
 * @param value A player's given value (eg. €3.50m)
 * @return Numerical representation of value string (eg. 3500000)
 */
function parsePlayerValue(value: string): number {
  // default value is 50k
  let result = 50000

  const match = value.match(/€([\d.]*)(.*)/)
  if (match) {
    result = parseFloat(match[1])
    switch (match[2]) {
      case 'm':
        result *= 1000000
        break
      case 'Th.':
        result *= 1000
        break
    }
  }

  return result
}

/**
 * Print player info to console.
 * @param players Array of player data
 */
function printPlayerInfo(players: Player[]): void {
  for (let player of players) {
    const { name, position, nationality, dateOfBirth, team, value } = player
    console.log(`Player: ${name}`)
    console.log(`Position: ${position}`)
    console.log(`Nationality: ${nationality.join(', ')}`)
    console.log(`Date of Birth: ${dateOfBirth}`)
    console.log(`Team: ${team}`)
    console.log(`Value: €${value[value.length - 1].amount}`)
    console.log('')
  }
}

/**
 * Gather player data from transfermarkt.com and save it to mongodb.
 */
export async function scrape(): Promise<Player[]> {
  let players: Player[] = []
  try {
    console.log('starting script...')

    // establish connection to website
    const axios = Axios.create({
      baseURL: 'https://www.transfermarkt.com',
    })

    // begin scraping premier league teams
    console.log('gathering premier league teams...')
    const response = await axios.get(
      '/premier-league/startseite/wettbewerb/GB1'
    )
    const $: cheerio.Root = cheerio.load(response.data)
    const teamElements = $('#yw1 > table > tbody').children()

    // obtain each team info by following their respective href links
    for (let i = 0; i < teamElements.length; i++) {
      let teamElement = teamElements[i]
      let teamName = $(teamElement)
        .find('td:nth-child(2) > tm-tooltip:nth-child(1) > a:nth-child(1)')
        .text()
        .trim()
      let teamUrl = $(teamElement)
        .find('td:nth-child(2) > tm-tooltip:nth-child(1) > a:nth-child(1)')
        .attr('href')
      console.log(`gathering players from ${teamName}...`)
      let teamResponse = await axios.get(teamUrl)
      // gather player info from team page
      let $t = cheerio.load(teamResponse.data)
      let playerElements = $t('#yw1 > table > tbody').children()
      playerElements.each((_, playerElement) => {
        players.push(getPlayerInfo($t, playerElement, teamName))
      })
    }

    console.log('scraping complete.')
  } catch (e) {
    console.error(e)
  }

  return players
}
