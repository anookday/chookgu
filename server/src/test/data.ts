import { CreateUserProfileDto } from '@users/dto/create-userProfile.dto'
import { PlayerDto } from '@players/dto/player.dto'

export const users: CreateUserProfileDto[] = [
  {
    email: 'johndoe@gmail.com',
    username: 'John Doe',
    password: 'johndoe123',
  },
  {
    email: 'marysue@outlook.com',
    username: 'Mary Sue',
    password: 'Y@@sQu33NN',
  },
  {
    email: 'sheesh@sheesh.com',
    username: 'SHEESH',
    password: '32qhriulfsy74q',
  },
]

// randomly shuffled list of top 20 Premier League players
export const players: PlayerDto[] = [
  {
    nationality: ['Portugal'],
    _id: 258004,
    currentValue: 75000000,
    dateOfBirth: '1997-05-13T15:00:00.000Z',
    image:
      'https://img.a.transfermarkt.technology/portrait/small/258004-1572340728.jpg?lm=1',
    name: 'Rúben Dias',
    position: 'Centre-Back',
    team: 'Manchester City',
    value: [
      {
        date: '2021-08-28T09:57:00.871Z',
        amount: 75000000,
      },
    ],
  },
  {
    nationality: ['Belgium'],
    _id: 88755,
    currentValue: 100000000,
    dateOfBirth: '1991-06-27T15:00:00.000Z',
    image:
      'https://img.a.transfermarkt.technology/portrait/small/88755-1626449012.jpg?lm=1',
    name: 'Kevin De Bruyne',
    position: 'Attacking Midfield',
    team: 'Manchester City',
    value: [
      {
        date: '2021-08-28T09:57:00.881Z',
        amount: 100000000,
      },
    ],
  },
  {
    nationality: ['Spain'],
    _id: 357565,
    currentValue: 70000000,
    dateOfBirth: '1996-06-21T15:00:00.000Z',
    image:
      'https://img.a.transfermarkt.technology/portrait/small/357565-1556022958.jpg?lm=1',
    name: 'Rodri',
    position: 'Defensive Midfield',
    team: 'Manchester City',
    value: [
      {
        date: '2021-08-28T09:57:00.878Z',
        amount: 70000000,
      },
    ],
  },
  {
    nationality: ['England'],
    _id: 258923,
    currentValue: 85000000,
    dateOfBirth: '1997-10-30T15:00:00.000Z',
    image:
      'https://img.a.transfermarkt.technology/portrait/small/258923-1565603308.png?lm=1',
    name: 'Marcus Rashford',
    position: 'Left Winger',
    team: 'Manchester United',
    value: [
      {
        date: '2021-08-28T09:57:05.146Z',
        amount: 85000000,
      },
    ],
  },
  {
    nationality: ['Senegal'],
    _id: 200512,
    currentValue: 85000000,
    dateOfBirth: '1992-04-09T15:00:00.000Z',
    image:
      'https://img.a.transfermarkt.technology/portrait/small/200512-1559901727.jpg?lm=1',
    name: 'Sadio Mané',
    position: 'Left Winger',
    team: 'Liverpool FC',
    value: [
      {
        date: '2021-08-28T09:57:08.319Z',
        amount: 85000000,
      },
    ],
  },
  {
    nationality: ['England'],
    _id: 314353,
    currentValue: 75000000,
    dateOfBirth: '1998-10-06T15:00:00.000Z',
    image:
      'https://img.a.transfermarkt.technology/portrait/small/314353-1559826986.jpg?lm=1',
    name: 'Trent Alexander-Arnold',
    position: 'Right-Back',
    team: 'Liverpool FC',
    value: [
      {
        date: '2021-08-28T09:57:08.312Z',
        amount: 75000000,
      },
    ],
  },
  {
    nationality: ['Germany'],
    _id: 170527,
    currentValue: 65000000,
    dateOfBirth: '1996-03-05T15:00:00.000Z',
    image:
      'https://img.a.transfermarkt.technology/portrait/small/170527-1471002206.jpg?lm=1',
    name: 'Timo Werner',
    position: 'Centre-Forward',
    team: 'Chelsea FC',
    value: [
      {
        date: '2021-08-28T09:57:03.093Z',
        amount: 65000000,
      },
    ],
  },
  {
    nationality: ['England'],
    _id: 401173,
    currentValue: 100000000,
    dateOfBirth: '2000-03-24T15:00:00.000Z',
    image:
      'https://img.a.transfermarkt.technology/portrait/small/401173-1623778009.jpg?lm=1',
    name: 'Jadon Sancho',
    position: 'Right Winger',
    team: 'Manchester United',
    value: [
      {
        date: '2021-08-28T09:57:05.147Z',
        amount: 100000000,
      },
    ],
  },
  {
    nationality: ['Portugal'],
    _id: 241641,
    currentValue: 70000000,
    dateOfBirth: '1994-08-09T15:00:00.000Z',
    image:
      'https://img.a.transfermarkt.technology/portrait/small/241641-1520189140.jpg?lm=1',
    name: 'Bernardo Silva',
    position: 'Attacking Midfield',
    team: 'Manchester City',
    value: [
      {
        date: '2021-08-28T09:57:00.881Z',
        amount: 70000000,
      },
    ],
  },
  {
    nationality: ['England', 'Ireland'],
    _id: 357662,
    currentValue: 70000000,
    dateOfBirth: '1999-01-13T15:00:00.000Z',
    image:
      'https://img.a.transfermarkt.technology/portrait/small/357662-1624883831.jpg?lm=1',
    name: 'Declan Rice',
    position: 'Defensive Midfield',
    team: 'West Ham United',
    value: [
      {
        date: '2021-08-28T09:57:25.825Z',
        amount: 70000000,
      },
    ],
  },
  {
    nationality: ['England'],
    _id: 132098,
    currentValue: 120000000,
    dateOfBirth: '1993-07-27T15:00:00.000Z',
    image:
      'https://img.a.transfermarkt.technology/portrait/small/132098-1623778520.jpg?lm=1',
    name: 'Harry Kane',
    position: 'Centre-Forward',
    team: 'Tottenham Hotspur',
    value: [
      {
        date: '2021-08-28T09:57:11.379Z',
        amount: 120000000,
      },
    ],
  },
  {
    nationality: ['Korea, South'],
    _id: 91845,
    currentValue: 85000000,
    dateOfBirth: '1992-07-07T15:00:00.000Z',
    image:
      'https://img.a.transfermarkt.technology/portrait/small/91845-1599987413.jpg?lm=1',
    name: 'Heung-min Son',
    position: 'Left Winger',
    team: 'Tottenham Hotspur',
    value: [
      {
        date: '2021-08-28T09:57:11.375Z',
        amount: 85000000,
      },
    ],
  },
  {
    nationality: ['Egypt'],
    _id: 148455,
    currentValue: 100000000,
    dateOfBirth: '1992-06-14T15:00:00.000Z',
    image:
      'https://img.a.transfermarkt.technology/portrait/small/148455-1546611604.jpg?lm=1',
    name: 'Mohamed Salah',
    position: 'Right Winger',
    team: 'Liverpool FC',
    value: [
      {
        date: '2021-08-28T09:57:08.322Z',
        amount: 100000000,
      },
    ],
  },
  {
    nationality: ['France', 'Martinique'],
    _id: 164770,
    currentValue: 70000000,
    dateOfBirth: '1993-04-24T15:00:00.000Z',
    image:
      'https://img.a.transfermarkt.technology/portrait/small/164770-1598301905.jpg?lm=1',
    name: 'Raphaël Varane',
    position: 'Centre-Back',
    team: 'Manchester United',
    value: [
      {
        date: '2021-08-28T09:57:05.137Z',
        amount: 70000000,
      },
    ],
  },
  {
    nationality: ['England'],
    _id: 406635,
    currentValue: 80000000,
    dateOfBirth: '2000-05-27T15:00:00.000Z',
    image:
      'https://img.a.transfermarkt.technology/portrait/small/406635-1594986905.jpg?lm=1',
    name: 'Phil Foden',
    position: 'Left Winger',
    team: 'Manchester City',
    value: [
      {
        date: '2021-08-28T09:57:00.883Z',
        amount: 80000000,
      },
    ],
  },
  {
    nationality: ['Portugal'],
    _id: 240306,
    currentValue: 90000000,
    dateOfBirth: '1994-09-07T15:00:00.000Z',
    image:
      'https://img.a.transfermarkt.technology/portrait/small/240306-1580389882.jpg?lm=1',
    name: 'Bruno Fernandes',
    position: 'Attacking Midfield',
    team: 'Manchester United',
    value: [
      {
        date: '2021-08-28T09:57:05.143Z',
        amount: 90000000,
      },
    ],
  },
  {
    nationality: ['England'],
    _id: 346483,
    currentValue: 75000000,
    dateOfBirth: '1999-01-09T15:00:00.000Z',
    image:
      'https://img.a.transfermarkt.technology/portrait/small/346483-1563203695.jpg?lm=1',
    name: 'Mason Mount',
    position: 'Attacking Midfield',
    team: 'Chelsea FC',
    value: [
      {
        date: '2021-08-28T09:57:03.080Z',
        amount: 75000000,
      },
    ],
  },
  {
    nationality: ['Belgium', 'DR Congo'],
    _id: 96341,
    currentValue: 100000000,
    dateOfBirth: '1993-05-12T15:00:00.000Z',
    image:
      'https://img.a.transfermarkt.technology/portrait/small/96341-1596033546.jpg?lm=1',
    name: 'Romelu Lukaku',
    position: 'Centre-Forward',
    team: 'Chelsea FC',
    value: [
      {
        date: '2021-08-28T09:57:03.092Z',
        amount: 100000000,
      },
    ],
  },
  {
    nationality: ['Germany'],
    _id: 309400,
    currentValue: 70000000,
    dateOfBirth: '1999-06-10T15:00:00.000Z',
    image:
      'https://img.a.transfermarkt.technology/portrait/small/309400-1620646226.jpg?lm=1',
    name: 'Kai Havertz',
    position: 'Attacking Midfield',
    team: 'Chelsea FC',
    value: [
      {
        date: '2021-08-28T09:57:03.081Z',
        amount: 70000000,
      },
    ],
  },
  {
    nationality: ['England', 'Jamaica'],
    _id: 134425,
    currentValue: 90000000,
    dateOfBirth: '1994-12-07T15:00:00.000Z',
    image:
      'https://img.a.transfermarkt.technology/portrait/small/134425-1577051521.jpg?lm=1',
    name: 'Raheem Sterling',
    position: 'Left Winger',
    team: 'Manchester City',
    value: [
      {
        date: '2021-08-28T09:57:00.882Z',
        amount: 90000000,
      },
    ],
  },
]
