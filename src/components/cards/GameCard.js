import React, { useEffect, useState } from 'react';
import cheerio from 'cheerio';
import request from 'request';

import { Card, CardContent, Typography, CircularProgress, Button} from '@material-ui/core';

import { cors, gameURL, randomGame, randomNumber } from "../Links";

const GameCard = (props) => {
    const [ data, setData ] = useState(undefined);
    const [ randomNum, setRandomNum ] = useState(0);
    const combinedURL = cors + gameURL;

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        let newNum = randomNumber(randomGame);
        setRandomNum(newNum);
        fetchGame(signal);
        return function cleanup() {
            abortController.abort();
        }
    }, [combinedURL])

    const fetchGame = async (signal) => {
        let tempData = [];

        request (cors + gameURL, signal, (error, resp, html) =>  {  
            if(!error && resp.statusCode === 200){
                const $ = cheerio.load(html);
                $(".article-page h2").each((i, elem) => {
                    if(tempData.length >= 8){
                        return;
                    }       
                    let title = $(elem).text();
                    let developers = $(elem).next();

                    developers.each((d, dev) => {
                        let developer = dev.children[0].data;
                        tempData.push({
                            game: {
                                title: title,
                                developer: developer
                            }
                        })
                    })
                })  
                setData(tempData);
            }
        })
    }

    const showGame = () =>{
        if(data === undefined){
            return null;
        }else {
            const { game } = data[randomNum];
            return `Game Title: ${game.title}`;
        }
    }

    const showDeveloper = () => {
        if(data === undefined){
            return null;
        } else {
            const { game } = data[randomNum];
            return game.developer;
        }
    }
    
    return(
        <Card className="creator-card">
            <CardContent>
                <Typography variant="h5">
                    {data === undefined ? <CircularProgress/> : showGame()}
                </Typography>
                <Typography variant="h6">
                    {showDeveloper()}
                </Typography>
                    <Button color="primary" variant="outlined" target="_blank" href="https://www.blackgamedevs.com/">
                        Click here for more Black Game Developers
                    </Button>
            </CardContent>
            
        </Card>
    )
}

export default GameCard;