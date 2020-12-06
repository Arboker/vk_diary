import React from 'react';
import { Text, Textarea, Button, Spinner } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from "@vkontakte/vk-bridge";
import Icon28CalendarOutline from '@vkontakte/icons/dist/28/calendar_outline';
import Icon28WriteOutline from '@vkontakte/icons/dist/28/write_outline';
import Icon24Story from '@vkontakte/icons/dist/24/story';
import Icon24Share from '@vkontakte/icons/dist/24/share';
import Icon28ReportOutline from '@vkontakte/icons/dist/28/report_outline';
import Icon24Report from '@vkontakte/icons/dist/24/report';
import imageLogo from './img/logo.jpg'
// import backgroundStory from './img/background_story.jpg'
import backgroundStory from './img/story.png'

import { isMobile } from 'react-device-detect';


class Question extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            question: '',
            title: this.props.title,
            id: this.props.id,
            answers: [],
            showModal: true,
            loadDataAgain: this.props.loadDataAgain,
            imageSrc: "",
            loadingStory: false,
            hrefInsert: this.props.hrefInsert,
            loaded: false,
            showAllText: []
        }
    }

    componentDidMount = () => {
        // this.updateCanvas();
        this.updateCanvas();
        // alert(this.props.creator)


        if (!this.props.isFromCategory) {
            if (this.props.isNew) {
                const paramsURL = new URLSearchParams(window.location.search);
                fetch('https://diary-2212.herokuapp.com/newquestion?' + paramsURL)
                    .then(response => response.json())
                    .then(data => { this.setState({ question: data, loaded: true }); });
            }
            else {
                this.loadAllAnswers();
            }
        }
        else {
            this.loadAllAnswers();
        }

    }

    loadAllAnswers = () => {
        const paramsURL = new URLSearchParams(window.location.search);

        if (this.props.loadingAnswer) {

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: this.state.title })
            };

            const requestOptionsUser = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: this.state.title, creator: this.props.creator })
            };

            if (this.state.hrefInsert == "insertanswer") {
                fetch('https://diary-2212.herokuapp.com/allanswers?' + paramsURL, requestOptions)
                    .then(response => response.json())
                    .then(data => { this.setState({ answers: data, loaded: true, loadingAnswered: true }); this.props.changeProps() });
            }
            else {
                fetch('https://diary-2212.herokuapp.com/allanswersusers?' + paramsURL, requestOptionsUser)
                    .then(response => response.json())
                    .then(data => { this.setState({ answers: data, loaded: true, loadingAnswer: true }); this.props.changeProps() });
            }
        }
    }

    insertAnswer = () => {
        const questionTitle = !this.props.isFromCategory ? this.props.isNew ? this.state.question.toString() : this.state.title : this.state.title;

        if (this.state.answer != undefined) {
            if (this.state.answer.length > 999) {
                this.props.openDefault("Ошибка", "Максимальный длинна ответа 999 символов!");
            }
            else {
                if (this.state.answer.replace(/\s/g, '').length != 0) {
                    const paramsURL = new URLSearchParams(window.location.search);
                    const date = new Date();
                    const dateQuestion = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2);
                    var requestOptions;
                    if (this.state.hrefInsert == "insertanswer") {
                        requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                question: questionTitle,
                                answer: this.state.answer, date: dateQuestion
                            })
                        };
                    }
                    else {
                        requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                question: this.state.question.toString(),
                                answer: this.state.answer, date: dateQuestion, creator: this.props.creator
                            })
                        };
                    }
                    fetch('https://diary-2212.herokuapp.com/' + this.props.hrefInsert + "?" + paramsURL, requestOptions)
                        .then(response => response.json())
                        .then(data => {
                            console.log(data)
                            if (data == "Limit") {
                                this.props.openDefault("Ошибка", "Во избежание флуда, ответьте ещё раз!")
                            }
                            else {
                                this.props.changeToMain(this.props.isFromCategory)
                            }
                        });
                }
            }
        }
    }

    handleChange = event => {
        this.setState({ answer: event.target.value })
    }

    changeScreen = (question) => {
        this.props.questionModal(this.state.title);
    }

    showHistory = () => {
        const urlQuestion = "https://vk.com/app7532498#q" + this.props.questionId;
        const urlUser = "https://vk.com/app7532498#u" + this.props.questionId;
        if (isMobile) {
            bridge.send('VKWebAppShowStoryBox', {
                "background_type": "image",
                "url": "https://i.ibb.co/1JvFSnf/new-background.jpg",
                // "blob": this.state.imageSrc,
                "stickers": [
                    {
                        "sticker_type": "renderable",
                        "sticker": {
                            "can_delete": 0,
                            "content_type": "image",
                            "blob": this.state.imageSrc,
                            "clickable_zones": [
                                {
                                    "action_type": "link",
                                    "action": {
                                        "link": this.state.hrefInsert == "insertanswer" ? urlQuestion : urlUser,
                                        "tooltip_text_key": "tooltip_open_default"
                                    },
                                    "clickable_area": {
                                        "gravity": "center_bottom"
                                    }
                                }
                            ]
                        }
                    },
                ]

            });
        }
        else {
            bridge.send('VKWebAppShowStoryBox', {
                "background_type": "image",
                "url": "https://i.ibb.co/1JvFSnf/new-background.jpg",
                // "blob": this.state.imageSrc,
                "stickers": [
                    {
                        "sticker_type": "renderable",
                        "sticker": {
                            "can_delete": 0,
                            "content_type": "image",
                            "blob": this.state.imageSrc,
                            "clickable_zones": [
                                {
                                    "action_type": "link",
                                    "action": {
                                        "link": this.state.hrefInsert == "insertanswer" ? urlQuestion : urlUser,
                                        "tooltip_text_key": "tooltip_open_default"
                                    },
                                    "clickable_area": [{
                                        "gravity": "center_bottom"
                                    }]
                                }
                            ]
                        }
                    },
                ]

            });
        }
        bridge.subscribe(e => e);

    }

    wrapText = (context, text, x, y, maxWidth, lineHeight) => {
        var words = text.split(' ');
        var line = '';

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }
        context.fillText(line, x, y);
    }

    updateCanvasNew = () => {
        const ctx = this.refs.canvas.getContext('2d');
        const questionTitle = this.props.isNew ? this.state.question.toString() : this.state.title;

        const canvas = this.refs.canvas;

        var maxWidth = 400;
        var lineHeight = 30;
        var x = (canvas.width - maxWidth) / 2;
        var y = 60;

        ctx.font = "30px 'Fira Sans', sans-serif";
        ctx.fillStyle = 'white';
        ctx.shadowColor = "black";
        ctx.shadowBlur = 7;

        this.wrapText(ctx, questionTitle, x, y, maxWidth, lineHeight);

        var dataURL = this.refs.canvas.toDataURL();
        this.setState({
            imageSrc: dataURL
        })

    }

    textTruncateQuuestion = (str, length, ending) => {
        if (length == null) {
            length = 60;
        }
        if (ending == null) {
            ending = '...';
        }
        if (str.length > length) {
            return str.substring(0, length - ending.length) + ending;
        } else {
            return str;
        }
    }

    updateCanvas = async () => {
        const ctx = this.refs.canvas.getContext('2d');
        const canvas = this.refs.canvas;

        const toDataURL = url => fetch(url)
            .then(response => response.blob())
            .then(blob => new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsDataURL(blob)
            }))
        const questionTitle = this.props.isNew ? this.state.question : this.state.title;

        const imageUrl = await toDataURL(imageLogo).then(dataUrl => dataUrl)
        var data = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
            '<foreignObject width="100%" height="100%">' +
            '<div xmlns="http://www.w3.org/1999/xhtml" style="border: 1px solid silver; border-radius: 6px; padding: 10px; background: #135094; ">' +
            '<div style="display: flex; padding-bottom: 10px">' +
            '<img src="' + imageUrl + '" width="50" height="50" style="border-radius: 6px;"></img>' +
            '<span style="font-size: 16px;font-family: Fira Sans, sans-serif; color: white; margin-left: 10px; word-break: break-word ">' +
            this.textTruncateQuuestion(questionTitle) + '</span>' +
            '</div>' +
            '<span style="font-size: 16px;font-family: Fira Sans, sans-serif; color: white; display: flex; justify-content:center;padding-top: 10px; border-top: 1px solid silver">Ответить</span>' +
            '</div>' +
            '</foreignObject>' +
            '</svg>';

        var DOMURL = window.URL || window.webkitURL || window;

        var img = new Image();

        const base = btoa(unescape(encodeURIComponent(data)));
        img.src = `data:image/svg+xml;base64,${base}`;

        var imgWidth;
        var show = false;

        const setStateImg = src => {
            this.setState({
                imageSrc: src
            })
        }

        img.onload = function () {
            canvas.height = 500;
            canvas.width = 500;

            ctx.drawImage(img, 0, 0, 500, 500);
            var dataURL = canvas.toDataURL();

            setStateImg(dataURL)
        }

    }

    share = () => {
        const urlQuestion = "https://vk.com/app7532498#q" + this.props.questionId;
        const urlUser = "https://vk.com/app7532498#u" + this.props.questionId;
        bridge.send("VKWebAppShare", { "link": this.state.hrefInsert == "insertanswer" ? urlQuestion : urlUser });
    }

    text_truncate = (answerID, str, length, ending) => {
        if (length == null) {
            length = 150;
        }
        if (ending == null) {
            ending = 'Показать все';
        }
        var showTXT = false;

        const findShowAllText = this.state.showAllText.find(item => item == answerID)

        if (str.length > length) {
            var textToShow = str.substring(0, length - ending.length)
            const changeStr = () => {
                if (findShowAllText == undefined) {
                    this.setState({
                        showAllText: this.state.showAllText.concat(answerID)
                    })
                }
                else {
                    this.setState({
                        showAllText: this.state.showAllText.filter(id => id !== answerID)
                    })
                }
                showTXT = true;
            }

            return (
                <div>
                    <div
                        onClick={() => this.props.updateAnswer(answerID, str)}
                        style={{ width: "90%", display: "flex", alignItems: str.length > 57 ? "unset" : "center", }}>
                        <Icon28WriteOutline />
                        <Text style={{ fontSize: 19, marginLeft: 5, wordBreak: "break-word" }}>
                            {findShowAllText == undefined ? textToShow : str}</Text>
                    </div>
                    <div
                        style={{ marginLeft: 28, marginTop: 2 }}
                        onClick={() => changeStr()}>
                        <Text
                            style={{
                                fontSize: 19, marginLeft: 5, wordBreak: "break-word",
                                color: this.props.theme == "space_gray" ? "rgb(113 180 255)" : "#2b7ede"
                            }}>{findShowAllText == undefined ? ending : "Свернуть"}</Text>
                    </div>
                </div>
            );
        } else {
            return (
                <div
                    onClick={() => this.props.updateAnswer(answerID, str)}
                    style={{ width: "90%", display: "flex", alignItems: str.length > 57 ? "unset" : "center", }}>
                    <Icon28WriteOutline />
                    <Text style={{ fontSize: 19, marginLeft: 5, wordBreak: "break-word" }}>
                        {str}</Text>
                </div>
            );
        }
    }

    render() {
        if (this.props.loadDataAgain) {
            this.loadAllAnswers();
        }
        const questionTitle = !this.props.isFromCategory ? this.props.isNew ? this.state.question.toString() : this.state.title : this.state.title;
        var styles = `html,
        body {
          margin: 0;
        }`;
        return (
            <div style={{ fontFamily: "'Fira Sans', sans-serif" }}>
                <style>
                    {styles}
                </style>
                <canvas ref="canvas" width="500" height="200" style={{ display: "none" }} />

                {this.state.loaded ? (
                    <div>
                        <div>
                            {/* <img src={this.state.imageSrc} alt='Image' style={{ width: 300, height: 300, marginLeft: 10 }} /> */}
                            <div style={{
                                background: this.props.theme == "space_gray" ? "#2b7ede" : "rgb(70, 145, 230)", display: "flex",
                                alignItems: "flex-end", justifyContent: "center", height: questionTitle.length > 40 ? "" : 140,
                                padding: "0 10px"
                            }}>
                                <Text style={{
                                    fontSize: questionTitle.length > 65 ? 28 : 32,
                                    lineHeight: "35px", maxWidth: "100%",
                                    color: "white", textAlign: "center", marginTop: 30,
                                    marginBottom: questionTitle.length > 50 ? 0 : questionTitle.length > 20 ? questionTitle.length > 35 ? 10 : 20 : 30
                                }}>{questionTitle}</Text>

                            </div>
                            <div style={{
                                display: "inline-block",
                                position: "relative",
                                width: "100%"
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1440 320" width="100%">
                                    <path fill={this.props.theme == "space_gray" ? "#2b7ede" : "rgb(70, 145, 230)"}
                                        style={{ width: "100%" }}
                                        fillOpacity="1" d="M0,96L48,106.7C96,117,192,139,288,144C384,149,480,139,576,133.3C672,128,768,128,864,138.7C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
                                </svg>
                            </div>
                        </div>

                        <div style={{
                            padding: 10, display: 'flex',
                            flexDirection: 'column',
                            zIndex: 9,
                        }}>

                            {this.props.isNew ? (
                                <div>

                                    <Textarea top="Ответ" placeholder="Ответ" onChange={this.handleChange} />

                                    <Button size="xl" style={{ backgroundColor: this.props.theme == "space_gray" ? "#2b7ede" : "#3f8ae0", color: "white", cursor: "pointer", marginTop: 30 }} onClick={() => this.insertAnswer()}>Ответить</Button>

                                </div>
                            ) : (
                                    <div style={{ marginTop: "-30px" }}>
                                        {this.state.hrefInsert == "insertanswerusers" ? (
                                            <div>
                                                {this.state.answers.length == 0 ? (
                                                    <div>

                                                    </div>
                                                ) : (
                                                        <div>
                                                            {this.props.myQuestion ? (
                                                                <div></div>
                                                            ) : (
                                                                    <Icon28ReportOutline style={{ float: "right" }}
                                                                        onClick={() => this.props.reportQuestion()} />
                                                                )}
                                                        </div>
                                                    )}
                                            </div>
                                        ) : (
                                                <div></div>
                                            )}
                                        <div>
                                            {this.state.answers.map(data => {
                                                const monthNames = [' января',
                                                    ' февраля',
                                                    ' марта',
                                                    ' апреля',
                                                    ' мая',
                                                    ' июня',
                                                    ' июля',
                                                    ' августа',
                                                    ' сентября',
                                                    ' октября',
                                                    ' ноября',
                                                    ' декабря'
                                                ];
                                                const date = data.date;
                                                const month = date.slice(0, -3).substring(5).replace(/^0+/, '');
                                                const day = date.substring(8).replace(/^0+/, '');
                                                const year = date.slice(0, -6).replace(/^0+/, '');
                                                return (
                                                    <div style={{ marginBottom: 15 }} key={data.answerID}>
                                                        <div style={{ display: "flex", alignItems: "center", marginBottom: 5 }}><Icon28CalendarOutline />
                                                            <Text style={{ fontSize: 19, marginLeft: 3 }}> {day} {monthNames[month - 1]} {year}</Text> </div>

                                                        <div style={{ display: "flex", alignItems: "center", marginBottom: 5, cursor: "pointer", justifyContent: "space-between" }}>

                                                            {/* <Text style={{ fontSize: 19, marginLeft: 5, wordBreak: "break-word" }}>{this.text_truncate(data.answer)}</Text> */}
                                                            {this.text_truncate(data.answerID, data.answer)}
                                                        </div>
                                                    </div>

                                                )
                                            })}
                                        </div>

                                        <div>
                                            <div style={{ display: "flex", marginBottom: 5, marginRight: 5 }}>
                                                <div style={{
                                                    backgroundColor: this.props.theme == "space_gray" ? "#2b7ede" : "rgb(70, 145, 230)", display: "flex", alignItems: "center",
                                                    borderRadius: 6, padding: "5px 10px"
                                                }}
                                                    onClick={() => this.share()}>
                                                    <Icon24Share style={{ marginRight: 5, color: "white" }} />
                                                    <Text style={{ fontSize: 18, color: "white" }}>Поделиться</Text>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", marginBottom: 5 }}>
                                                <div style={{
                                                    backgroundColor: this.props.theme == "space_gray" ? "#2b7ede" : "rgb(70, 145, 230)", display: "flex", alignItems: "center",
                                                    borderRadius: 6, padding: "5px 10px"
                                                }}
                                                    onClick={() => this.showHistory()}>
                                                    <Icon24Story style={{ marginRight: 5, color: "white" }} />
                                                    <Text style={{ fontSize: 18, color: "white", cursor: "pointer" }}>Спросить у друзей</Text>
                                                </div>
                                            </div>
                                            {this.state.hrefInsert == "insertanswerusers" ? (
                                                <div>
                                                    {this.state.answers.length == 0 ? (
                                                        <div>
                                                            {!this.props.myQuestion ? (
                                                                <div style={{ marginBottom: 5, display: "flex" }}>
                                                                    <div style={{
                                                                        backgroundColor: this.props.theme == "space_gray" ? "#2b7ede" : "rgb(70, 145, 230)", display: "flex", alignItems: "center",
                                                                        borderRadius: 6, padding: "5px 10px"
                                                                    }}
                                                                        onClick={() => this.props.reportQuestion()}
                                                                    >
                                                                        <Icon24Report style={{ marginRight: 5, color: "white" }} />
                                                                        <Text style={{ fontSize: 18, color: "white", cursor: "pointer" }}>Пожаловаться</Text>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                    <div></div>
                                                                )}
                                                        </div>
                                                    ) : (
                                                            <div>
                                                            </div>
                                                        )}
                                                </div>
                                            ) : (
                                                    <div></div>
                                                )}
                                        </div>
                                        <Button mode="secondary" size="xl" style={{ cursor: "pointer", marginTop: 10 }} onClick={() => this.changeScreen(this.state.question)}>Добавить ответ</Button>
                                    </div>
                                )}
                        </div>
                    </div>
                ) : (
                        <div>
                            <Spinner size="medium" style={{ marginTop: 20 }} />
                        </div>
                    )
                }
            </div>
        );
    }
}

export default Question;