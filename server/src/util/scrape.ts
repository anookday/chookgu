import Axios from 'axios'
import { CheerioAPI, Element, load } from 'cheerio'
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
  $: CheerioAPI,
  playerElement: Element,
  id: number,
  team: string
): Player {
  const name = $(playerElement)
    .find(
      'td:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(2) > div:nth-child(1) > span > a'
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
    },
  ]
  return {
    _id: id,
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
  // give player a default value of 50k
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
 * @param player player DOM element
 */
function printPlayerInfo(player: Player): void {
  let { name, position, nationality, dateOfBirth, team, currentValue } = player
  console.log(`Player: ${name}`)
  console.log(`Position: ${position}`)
  console.log(`Nationality: ${nationality.join(', ')}`)
  console.log(`Date of Birth: ${dateOfBirth}`)
  console.log(`Team: ${team}`)
  console.log(`Value: €${currentValue}`)
  console.log('-------------------')
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
    const $ = load(response.data)
    const teamElements = $('#yw1 > table > tbody').children()

    // obtain each team info by following their respective href links
    let id = 0
    for (let i = 0; i < teamElements.length; i++) {
      let teamElement = teamElements[i]
      // team name
      let teamName = $(teamElement)
        .find('td:nth-child(2) > a:nth-child(1)')
        .text()
        .trim()
      if (!teamName) throw new Error('Unable to find team name')
      // team url page
      let teamUrl = $(teamElement)
        .find('td:nth-child(2) > a:nth-child(1)')
        .attr('href')
      if (!teamUrl) throw new Error(`Unable to find url for ${teamName}`)
      console.log(`gathering players from ${teamName}...`)
      let teamResponse = await axios.get(teamUrl)
      // gather player info from team page
      let $t = load(teamResponse.data)
      // team players
      let playerElements = $t('#yw1 > table > tbody').children()
      if (playerElements.length === 0)
        throw new Error(`Unable to retrieve players from ${teamName}`)
      // add players to list
      playerElements.each((_, playerElement) => {
        let player = getPlayerInfo($t, playerElement, id, teamName)
        printPlayerInfo(player)
        players.push(player)
        id++
      })
    }

    console.log('scraping complete.')
  } catch (e) {
    console.error(e)
  }

  return players
}
