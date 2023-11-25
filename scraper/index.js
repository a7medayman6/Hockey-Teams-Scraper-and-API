const axios = require('axios');

const cheerio = require('cheerio');

const path = require('path');

const dotenv = require('dotenv');

dotenv.config();

const logger = require('./utils/logger');

const { createChannel, sendMessageToQueue, closeChannel, closeConnection } = require('./utils/rabbitMQ');


// Constants
const filename = path.basename(__filename);
const base_url = 'https://www.scrapethissite.com/pages/forms/?page_num=';


const QUEUE_NAME = process.env.QUEUE_NAME || 'hokey_teams';

const teams = [];

const getTeamsPage = async (page) => 
{
    const { conn, channel } = await createChannel(QUEUE_NAME);

    let url = base_url + page;
    logger.log(filename, `Scraping ${url} ...`);
    await axios.get(url)
        .then(response => 
        {
            if (response.status === 200) 
            {
                const html = response.data;
                const $ = cheerio.load(html);
                const teams_list = $('.team');
                

                teams_list.each(async function () 
                {
                    // load name, year, wins, ... from the team which are a td elements with classes name, year, wins, ...

                    const name = $(this).find('.name').text().trim();
                    const year = $(this).find('.year').text().trim();
                    //logger.log(filename, year)
                    const wins = $(this).find('.wins').text().trim();
                    const losses = $(this).find('.losses').text().trim();
                    const win_percentage = $(this).find('.pct').text().trim();
                    const goals_for = $(this).find('.gf').text().trim();
                    const goals_against = $(this).find('.ga').text().trim();
                    const diff = $(this).find('.diff').text().trim();

                    const team = { name: name, year: year, wins: wins, losses: losses, win_percentage: win_percentage, goals_for: goals_for, goals_against: goals_against, diff: diff };
                    logger.log(filename, `${team.name} | ${team.year} | ${team.wins} | ${team.losses} | ${team.win_percentage} | ${team.goals_for} | ${team.goals_against} | ${team.diff}`);
                    
                    // Send the team to the queue
                    await sendMessageToQueue(channel, QUEUE_NAME, team);
                    teams.push(team);
                });

            }
        }).catch(error => logger.error(filename, error));

        //await closeChannel(channel);
        //await closeConnection(conn);
        logger.log(filename, "Scraping completed!");

};


// Variables
let page = 1;
const number_of_pages = 24;
// Main

for (page = 1; page <= number_of_pages; page++)
{
    getTeamsPage(page);
}




