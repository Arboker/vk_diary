import React from 'react';
import { Text, Title, Button, View, Spinner, FixedLayout } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from "@vkontakte/vk-bridge";
import diary from './img/calendar.png'
import category from './img/category.png'
import Icon24Add from '@vkontakte/icons/dist/24/add';
import error from './img/error.png'

import SpinnerBook from './SpinnerBook'

class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
            answered: [],
            loading: true
        }
    }

    componentDidMount = () => {
        // if (!this.props.canLoadQuestion) {
        //     this.loadAllAnswers();
        // }
    }

    loadAllAnswers = () => {
        let body = document.getElementById('main');
        const idUser = body.getAttribute("idUser");
    }

    changeQuestionScreen = (isNew, nameQuestion, answer, creator, idQuestion) => {
        window.history.pushState({ panel: "question" }, "question")
        this.props.changeQuestion(isNew, nameQuestion, answer, creator, idQuestion);
    }

    changeScreen = (screen) => {
        window.history.pushState({ panel: screen }, screen)
        this.props.changeScreenApp(screen);
    }

    text_truncate = (str, length, ending) => {
        if (length == null) {
            length = 150;
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

    render() {
        const questionsObject = this.props.answered;
        // if (this.props.canLoadQuestion) {
        //     this.loadAllAnswers();
        //     this.props.changeLoading();
        // }
        return (
            <div style={{ padding: 10 }}>
                <div style={{ marginTop: 30 }}>
                    <div style={{
                        background: this.props.theme == "space_gray" ? "rgb(234 67 67)" : '#ff5e5e', height: 90,
                        borderRadius: 25, padding: "0  20px"
                    }}
                        onClick={() => this.changeScreen("calendar")}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", cursor: "pointer" }}>
                            <div style={{
                                alignItems: "center", marginTop: 20, fontFamily: "'Fira Sans', sans-serif"
                            }}>
                                <Text style={{ color: "#e0e0e0", marginBottom: 10 }}>Перейти  в</Text>
                                <Text style={{ fontSize: 26, color: "white" }}>Календарь</Text>
                            </div>
                            <img src={diary} alt='Image' style={{ width: 95, height: 95, marginTop: "-20px" }} />
                        </div>
                    </div>

                    <div style={{
                        background: this.props.theme == "space_gray" ? "rgb(234 67 67)" : '#ff5e5e', height: 90,
                        borderRadius: 25, padding: "0  20px", marginTop: 30
                    }}
                        onClick={() => this.changeScreen("category")}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", cursor: "pointer" }}>
                            <div style={{
                                alignItems: "center", marginTop: 20, fontFamily: "'Fira Sans', sans-serif"
                            }}>
                                <Text style={{ color: "#e0e0e0", marginBottom: 10 }}>Перейти  в</Text>
                                <Text style={{ fontSize: 26, color: "white" }}>Категории</Text>
                            </div>
                            <img src={category} alt='Image' style={{ width: 95, height: 95, marginTop: "-20px" }} />
                        </div>
                    </div>

                    <Title level="1" weight="bold" style={{ marginTop: 20, paddingBottom: 10, fontFamily: "'Fira Sans', sans-serif" }}>Вопросы</Title>

                </div>

                {this.props.loading ? (
                    <div>
                        <Spinner size="medium" style={{ marginTop: 20 }} />
                    </div>
                ) : (
                        <div style={{ marginBottom: 60 }}>
                            {questionsObject != "" ? (
                                <div>
                                    {questionsObject.map(item => {
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
                                        const year = date.slice(0, -6).replace(/^0+/, '');
                                        return (
                                            <div key={item.id}>

                                                <div
                                                    onClick={() => this.changeQuestionScreen(false, item.question, item.answer, "", item.id)}
                                                    style={{
                                                        marginTop: 15, zIndex: 9, boxShadow: this.props.theme == "space_gray" ? '0 0px 10px 0 rgb(74 74 74)' : '0 0px 10px 0 rgba(16, 36, 94, 0.2)',
                                                        borderRadius: 6, padding: "15px 10px", cursor: "pointer"
                                                    }}>
                                                    <div style={{ display: "flex", fontFamily: "'Fira Sans', sans-serif" }}>
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
                                                        <div style={{ display: "grid" }}>
                                                            <Text style={{ fontSize: 20, marginBottom: 12 }}>{item.question}</Text>
                                                            <Text style={{ fontSize: 17, color: this.props.theme == "space_gray" ? "rgb(173 171 171)" : "#5e5e5e", wordBreak: "break-word" }}>{this.text_truncate(item.answer)}</Text>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                    <div style={{ paddingTop: 50, display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                                        <img src={error} alt='Image' style={{ width: 200, height: 200, marginTop: "-30px" }} />

                                        <Text style={{ fontSize: 20, textAlign: "center", width: "calc(100% / 1.2)", paddingTop: 15, fontFamily: "'Fira Sans', sans-serif" }}>Вы еще не ответили ни на один вопрос!</Text>
                                    </div>
                                )}

                        </div>
                    )}
                <FixedLayout vertical="bottom" style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: 10
                }}>
                    <div style={{ zIndex: 99999 }}>
                        <Icon24Add style={{
                            zIndex: 99999, marginBottom: 10, marginRight: 10, marginTop: 3, backgroundColor: this.props.theme == "space_gray" ?
                                "#2b7ede" : "rgb(70 145 230)",
                            color: "white", cursor: "pointer", borderRadius: 50, padding: 15
                        }}
                            onClick={() => this.changeQuestionScreen("true", "", "", "", "")}></Icon24Add>
                    </div>
                </FixedLayout>
            </div>
        );
    }
}

export default Main;