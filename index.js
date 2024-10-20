import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
//PATH SETUP
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const port = process.env.PORT||3000;

//send the homepage
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


/*  gemini */ 
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//function to get the locations using gemini
const generateContent = async (prompt) => { 
    const result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: prompt,
              }
            ],
          }
        ],
        generationConfig: {
          maxOutputTokens: 100,
          temperature: 0.1,
        },
      });
    return result.response.text();
};

/*fetch images url*/
const fetchImage = async (location) => {
    try {
        let response = await fetch(`https://api.unsplash.com/search/photos?query=${location}&count=3&client_id=${process.env.ACCESS_KEY}`);
        let data = await response.json(); // Converts JSON to JavaScript object
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

/*Send Homepage */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/*Endpoint to generate location */
app.post('/generate', async(req, res) => {
    //here we got the input from the input box
    let input = req.body.prompt;

    //modify the input
    let prompt ="Do not answer in sentences.Just predict 3 places with their country name.Here is the description of the unknown place: "+input;
    //generate  location
    const text = await generateContent(prompt);
    const locations = text.split('\n').map(line => line.replace('- ', '').trim());
    //we got the 3 locations in arrayform
    console.log(locations);

    let place = [];

    for(let i=0;i<3;i++){
        let data = await fetchImage(locations[i]);
        let url = [];
        for(let j=0;j<3;j++){
            url[j]=data.results[Math.floor(Math.random() * 10)].urls.regular;
        }
        place[i]={
            locationName:locations[i],
            urls: url
        };
    }
    res.json(place)
});

app.listen(port,()=>{
    console.log(`Server running at http://localhost:${port}`);
})
