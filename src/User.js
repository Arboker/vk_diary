import React from 'react';
import { Text, Button, Title, Avatar, Link, Spinner } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from "@vkontakte/vk-bridge";

class Firstly extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.userId,
            name: this.props.userName,
            avatar: this.props.userPicture,
            answered: [],
            loadingQuestion: true
        }
    }

    componentDidMount = () => {
        const paramsURL = new URLSearchParams(window.location.search);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: this.props.userId })
        };
        fetch('https://diary-2212.herokuapp.com/questionsbyuser?'+paramsURL, requestOptions)
            .then(response => response.json())
            .then(data => { this.setState({ answered: data, loadingQuestion: false }); });

    }

    changeQuestionScreen = (isNew, nameQuestion, answer, creator, idQuestion) => {
        window.history.pushState({ panel: "questionProfile" }, "questionProfile")
        this.props.changeQuestion(isNew, nameQuestion, answer, creator, idQuestion);
    }

    goToCreate = () => {
        this.props.goToCreateScreen();
    }

    render() {
        const userHref = "https://vk.com/id" + this.state.id;
        var titleQuestion = "вопросов";
        if (this.state.answered.length == 1) {
            titleQuestion = "вопрос"
        }
        if (this.state.answered.length > 1 && this.state.answered.length <= 4) {
            titleQuestion = "вопроса"
        }
        return (
            <div style={{ fontFamily: "'Fira Sans', sans-serif" }}>
                <div style={{ height: 0 }}>
                    <div style={{
                        background: this.props.theme == "space_gray" ? "#2b7ede" : "rgb(70, 145, 230)", height: 90, display: "flex",
                        alignItems: "flex-end"
                    }}>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                        <path fill={this.props.theme == "space_gray" ? "#2b7ede" : "rgb(70, 145, 230)"} fill-opacity="1" d="M0,128L48,138.7C96,149,192,171,288,176C384,181,480,171,576,176C672,181,768,203,864,218.7C960,235,1056,245,1152,229.3C1248,213,1344,171,1392,149.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
                    </svg>
                </div>
                <div style={{ padding: "15px 10px" }}>
                    <div style={{ display: "flex" }}>
                        <Avatar src={this.state.avatar} size={104} style={{ marginBottom: 8 }} />
                        <div style={{ display: "flex", flexDirection: "column", marginLeft: 10, alignSelf: "center" }}>
                            <Text style={{ fontSize: 17, fontWeight: "bold", marginBottom: 2, color: "white" }}>{this.state.name}</Text>
                            <Text style={{ marginBottom: 10, color: "#f5f5f5" }}>Создал {this.state.answered.length} {titleQuestion}</Text>
                            <Link href={userHref} target="_blank"> <Button style={{cursor: "pointer"}} mode="overlay_outline">Перейти</Button></Link>
                        </div>
                    </div>
                </div>

                <div style={{ padding: 10, marginTop: 20 }}>
                    <Title level="2" weight="bold" style={{ marginTop: 5, paddingBottom: 10, fontFamily: "'Fira Sans', sans-serif" }}>Вопросы</Title>
                    {this.state.loadingQuestion ? (
                        <div>
                            <Spinner size="medium" style={{ marginTop: 20, marginBottom: 20 }} />
                        </div>
                    ) : (
                            <div>
                                {this.state.answered.map(item => {
                                    const monthNames = [' января',
                                        ' фев.',
                                        ' мар.',
                                        ' апр.',
                                        ' мая',
                                        ' июн.',
                                        ' июл.',
                                        ' авг.',
                                        ' сен.',
                                        ' окт.',
                                        ' ноя.',
                                        ' дек.'
                                    ];
                                    const date = item.date;
                                    const month = date.slice(0, -3).substring(5).replace(/^0+/, '');
                                    const day = date.substring(8).replace(/^0+/, '');
                                    return (
                                        <div>

                                            <div
                                                onClick={() => this.changeQuestionScreen(false, item.question, item.question, item.creator, item.id)}
                                                style={{
                                                    marginTop: 15, zIndex: 9, boxShadow: this.props.theme == "space_gray" ? '0 0px 10px 0 rgb(74 74 74)' : '0 0px 10px 0 rgba(16, 36, 94, 0.2)',
                                                    borderRadius: 6, padding: "15px 10px", cursor: "pointer"
                                                }}>
                                                <div>
                                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                        <div style={{ display: "flex", marginRight: 10 }}>
                                                            <Avatar src={this.state.avatar} size={50} />
                                                            <div style={{ alignSelf: "center", marginLeft: 10 }}>
                                                                <Text style={{
                                                                    color: this.props.theme == "space_gray" ? "#e1e3e6" : "black", fontSize: 16, paddingBottom: 1
                                                                }}>{this.state.name}</Text>
                                                                <div style={{ paddingTop: 3 }}>
                                                                    <Text style={{
                                                                        color: this.props.theme == "space_gray" ? "#e1e3e6" : "black", fontSize: 18, paddingBottom: 1,
                                                                        wordBreak: "break-word"
                                                                    }}>{item.question}</Text>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div style={{
                                                            marginRight: 10, background: this.props.theme == "space_gray" ?
                                                                "linear-gradient(rgb(236 82 82) 0%, rgb(236 106 106) 50%, rgb(234 125 125) 100%)" :
                                                                'linear-gradient(180deg, rgba(255,110,110,1) 0%, rgba(255,125,125,1) 50%, rgba(255,151,151,1) 100%)',
                                                            borderRadius: 6, padding: 10,
                                                            display: "inline-table"
                                                        }}>
                                                            <Text style={{ fontSize: 21, color: "white", marginBottom: 3 }}>{("0" + (day)).slice(-2)}</Text>
                                                            <Text style={{ fontSize: 20, color: "white" }}>{monthNames[month - 1]}</Text>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    )
                                })}
                            </div>
                        )}


                </div>
            </div>
        );
    }
}

export default Firstly;