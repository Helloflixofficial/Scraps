import axios from 'axios';
import cheerio from 'cheerio';
export default async function handler(req, res) {
    try {
      // Fetch the HTML data from the website
      const { data } = await axios.get('https://www5.gogoanimes.fi/');
  
      // Load the HTML data into Cheerio
      const $ = cheerio.load(data);
  
      // Scrape the thumbnail data
      const thumbnails = $('.thumbnail').map((index, element) => ({
        imageUrl: $(element).find('img').attr('src'),
        title: $(element).find('.name').text(),
      })).get();
  
      // Scrape the text data
      const textData = $('p').text();
  
      // Scrape the video data
      const videoData = $('.video').map((index, element) => ({
        videoUrl: $(element).find('source').attr('src'),
        title: $(element).find('.name').text(),
      })).get();
  
      // Return the scraped data as a response
      res.status(200).json({ thumbnails, textData, videoData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while scraping the data.' });
    }
  }