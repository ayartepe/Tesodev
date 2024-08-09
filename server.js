const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(express.static('public'));

app.post('/addPerson', (req, res) => {
    const newPerson = req.body;
    fs.readFile('mock-data.json', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            return res.status(500).json({ message: 'Error reading data file' });
        }

        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing JSON data:', parseErr);
            return res.status(500).json({ message: 'Error parsing data file' });
        }

        jsonData.data.push([
            newPerson.id,
            newPerson.nameSurname,
            newPerson.company,
            newPerson.email,
            newPerson.phone,
            newPerson.website,
            newPerson.country,
            newPerson.city,
            newPerson.date
        ]);

        fs.writeFile('mock-data.json', JSON.stringify(jsonData, null, 2), err => {
            if (err) {
                console.error('Error writing to data file:', err);
                return res.status(500).json({ message: 'Error writing to data file' });
            }

            res.status(200).json({ message: 'Person added successfully' });
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});