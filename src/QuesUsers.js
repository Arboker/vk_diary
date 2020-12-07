import React from 'react';
import { Text, Title, Group, HorizontalScroll, Avatar, Spinner } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from "@vkontakte/vk-bridge";
import Icon24User from '@vkontakte/icons/dist/24/user';

import error from './img/error.png'

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'

class QuesUsers extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'allQuestions',
            loading: true,
            name: "",
            avatar: "",
            allUsers: [],
            loaded: false,
            feed: [],
            answeredUsers: [],
            id: "",
            theme: "",
            loadedQuestion: false
        }
    }

    componentDidMount = () => {
        const paramsURL = new URLSearchParams(window.location.search);

        bridge.send("VKWebAppGetUserInfo", {}).then(event => {
            this.setState({
                id: event.id,
                name: event.first_name + " " + event.last_name,
                avatar: event.photo_100,
            })
        })

        fetch('https://diary-2212.herokuapp.com/feed?' + paramsURL)
            .then(response => response.json())
            .then(data => { 
                const shuffleArray = arr => arr
            .map(a => [Math.random(), a])
            .sort((a, b) => a[0] - b[0])
            .map(a => a[1]);
                this.setState({ feed: shuffleArray(data), loaded: true, loadedQuestion: true });
             });

        fetch('https://diary-2212.herokuapp.com/questionsbyuser?' + paramsURL)
            .then(response => response.json())
            .then(data => {
                if (data.toString() == "No questions") {
                    this.setState({ loading: false, answered: [] });
                }
                else {
                    this.setState({ answered: data, loading: false });
                }
            });

        fetch('https://diary-2212.herokuapp.com/answeredonusers?' + paramsURL)
            .then(response => response.json())
            .then(data => { this.setState({ answeredUsers: data, loaded: true }); });

        fetch('https://diary-2212.herokuapp.com/userinfo?' + paramsURL)
            .then(response => response.json())
            .then(data => { this.setState({ allUsers: data, loaded: true }); });

    }

    changeQuestionScreen = (isNew, nameQuestion, answer, creator, idQuestion, myQuestion) => {
        window.history.pushState({ panel: "questionProfile" }, "questionProfile")
        this.props.changeQuestion(isNew, nameQuestion, answer, creator, idQuestion, myQuestion == undefined ? false : true);
    }

    userNav = (id, name, avatar, sex) => {
        window.history.pushState({ panel: "questionProfile" }, "questionProfile")
        this.props.changeUser(id, name, avatar, sex);
    }

    chnageTab = (tab) => {
        this.setState({
            activeTab: tab
        })
    }

    render() {

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
        return (
            <div style={{ fontFamily: "'Fira Sans', sans-serif" }}>
                {this.state.allUsers == "" ? (
                    <div></div>
                ) : (
                        <Title level="1" weight="bold" style={{ marginTop: 5, paddingBottom: 10, fontFamily: "'Fira Sans', sans-serif", padding: 10 }}>Интересные пользователи</Title>
                    )}

                <Group style={{ paddingBottom: 8 }}>
                    {this.state.loaded ? (
                        <HorizontalScroll>
                            <div style={{ display: 'flex', padding: "0 10px" }}>
                                {this.state.allUsers.map(user => {
                                    return (
                                        <div style={{ ...itemStyle }}
                                            onClick={() => this.userNav(user.username, user.name, user.avatar, user.sex)}
                                        >
                                            <Avatar src={user.avatar} size={64} style={{ marginBottom: 8 }} />
                                            <Text style={{ marginTop: 2, textAlign: "center" }}>{user.name}</Text>
                                        </div>
                                    )
                                })}
                            </div>
                        </HorizontalScroll>
                    ) : (
                            <div>
                                {!this.state.loadedQuestion ? (
                                    <div></div>
                                ) : (
                                        <div>
                                            <Spinner size="medium" style={{ marginTop: 20, marginBottom: 20 }} />
                                        </div>
                                    )}
                            </div>
                        )}
                </Group>

                <div style={{ padding: 10 }}>

                    {this.state.loadedQuestion ? (
                        <div>
                            <div style={{ paddingTop: this.state.allUsers == "" ? 0 : 10, display: "flex", marginBottom: 17, flexWrap: "wrap" }}>
                                <Text onClick={() => this.chnageTab("allQuestions")}
                                    style={{
                                        border: this.state.activeTab == "allQuestions" ? "1px solid rgb(70, 145, 230)" : '1px solid silver',
                                        background: this.state.activeTab == "allQuestions" ? this.props.theme == "space_gray" ? "#2b7ede" : "rgb(70 145 230)" : "",
                                        color: this.state.activeTab == "allQuestions" ? "white" : this.props.theme == "space_gray" ? "white" : "black",
                                        padding: "6px 15px", borderRadius: 12, marginRight: 10, marginBottom: 10, cursor: "pointer"
                                    }}>Лента</Text>
                                <Text onClick={() => this.chnageTab("myQuestions")}
                                    style={{
                                        border: this.state.activeTab == "myQuestions" ? "1px solid rgb(70, 145, 230)" : '1px solid silver',
                                        background: this.state.activeTab == "myQuestions" ? this.props.theme == "space_gray" ? "#2b7ede" : "rgb(70 145 230)" : "",
                                        color: this.state.activeTab == "myQuestions" ? "white" : this.props.theme == "space_gray" ? "white" : "black",
                                        padding: "6px 15px", borderRadius: 12, marginRight: 10, marginBottom: 10, cursor: "pointer"
                                    }}>Мои вопросы</Text>
                                <Text onClick={() => this.chnageTab("answered")}
                                    style={{
                                        border: this.state.activeTab == "answered" ? "1px solid rgb(70, 145, 230)" : '1px solid silver',
                                        background: this.state.activeTab == "answered" ? this.props.theme == "space_gray" ? "#2b7ede" : "rgb(70 145 230)" : "",
                                        color: this.state.activeTab == "answered" ? "white" : this.props.theme == "space_gray" ? "white" : "black",
                                        padding: "6px 15px", borderRadius: 12, marginBottom: 10, cursor: "pointer"
                                    }}>Отвеченные</Text>
                            </div>
                            {
                                this.state.activeTab == "allQuestions" ? (
                                    <div>
                                        {this.state.feed.map(feed => {
                                            const date = feed.date;
                                            const month = date.slice(0, -3).substring(5).replace(/^0+/, '');
                                            const day = date.substring(8).replace(/^0+/, '');
                                            return (
                                                <div
                                                    onClick={() => this.changeQuestionScreen(false, feed.question, feed.question, feed.username, feed.idOfQuestion)}
                                                    style={{
                                                        marginTop: 15, zIndex: 9, boxShadow: this.props.theme == "space_gray" ? '0 0px 10px 0 rgb(74 74 74)' : '0 0px 10px 0 rgba(16, 36, 94, 0.2)',
                                                        borderRadius: 6, padding: "15px 10px", cursor: "pointer"
                                                    }}>
                                                    <div>
                                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                            <div style={{ display: "flex", marginRight: 10 }}>
                                                                <Avatar src={feed.avatar} size={50} />
                                                                <div style={{ alignSelf: "center", marginLeft: 10 }}>
                                                                    <Text style={{
                                                                        color: this.props.theme == "space_gray" ? "#e1e3e6" : "black", fontSize: 16, paddingBottom: 1
                                                                    }}>{feed.name}</Text>
                                                                    <div style={{ paddingTop: 5 }}>
                                                                        <Text style={{
                                                                            color: this.props.theme == "space_gray" ? "#e1e3e6" : "black", fontSize: 18, paddingBottom: 1,
                                                                            wordBreak: "break-word"
                                                                        }}>{feed.question}</Text>
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
                                            );
                                        })}
                                    </div>
                                ) : (
                                        <div>
                                            {this.state.activeTab == "myQuestions" ? (
                                                <div>
                                                    {this.state.answered != "" ? (
                                                        <div>
                                                            {this.state.answered.map(item => {
                                                                const date = item.date;
                                                                const month = date.slice(0, -3).substring(5).replace(/^0+/, '');
                                                                const day = date.substring(8).replace(/^0+/, '');
                                                                return (
                                                                    <div>

                                                                        <div
                                                                            onClick={() => this.changeQuestionScreen(false, item.question, item.question, item.creator, item.id, true)}
                                                                            style={{
                                                                                marginTop: 15, zIndex: 9, boxShadow: this.props.theme == "space_gray" ? '0 0px 10px 0 rgb(74 74 74)' : '0 0px 10px 0 rgba(16, 36, 94, 0.2)',
                                                                                borderRadius: 6, padding: "15px 10px",
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
                                                    ) : (
                                                            <div style={{ paddingTop: 45, display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                                                                <img src={error} alt='Image' style={{ width: 200, height: 200, marginTop: "-30px" }} />

                                                                <Text style={{ fontSize: 20, textAlign: "center", width: "calc(100% / 1.2)", paddingTop: 15 }}>Вы еще не создали ни одного вопроса!</Text>
                                                            </div>
                                                        )}

                                                </div>
                                            ) : (
                                                    <div>
                                                        {this.state.answeredUsers != "" ? (
                                                            <div>
                                                                {this.state.answeredUsers.map(answer => {
                                                                    const date = answer.date;
                                                                    const month = date.slice(0, -3).substring(5).replace(/^0+/, '');
                                                                    const day = date.substring(8).replace(/^0+/, '');
                                                                    const year = date.slice(0, -6).replace(/^0+/, '');
                                                                    return (
                                                                        <div
                                                                            onClick={() => this.changeQuestionScreen(false, answer.question, answer.question, answer.userUsername, answer.id)}
                                                                            style={{
                                                                                marginTop: 15, zIndex: 9, boxShadow: this.props.theme == "space_gray" ? '0 0px 10px 0 rgb(74 74 74)' : '0 0px 10px 0 rgba(16, 36, 94, 0.2)',
                                                                                borderRadius: 6, padding: "15px 10px",
                                                                            }}>
                                                                            <div>
                                                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                                                    <div style={{ display: "flex", marginRight: 10 }}>
                                                                                        <Avatar src={answer.userAvatar} size={50} />
                                                                                        <div style={{ alignSelf: "center", marginLeft: 10 }}>
                                                                                            <Text style={{
                                                                                                color: this.props.theme == "space_gray" ? "#e1e3e6" : "black", fontSize: 16, paddingBottom: 1
                                                                                            }}>{answer.userName}</Text>
                                                                                            <div style={{ paddingTop: 3 }}>
                                                                                                <Text style={{
                                                                                                    color: this.props.theme == "space_gray" ? "#e1e3e6" : "black", fontSize: 18, paddingBottom: 1,
                                                                                                    wordBreak: "break-word"
                                                                                                }}>{answer.question}</Text>
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
                                                                    );
                                                                })}
                                                            </div>
                                                        ) : (
                                                                <div style={{ paddingTop: 45, display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                                                                    <img src={error} alt='Image' style={{ width: 200, height: 200, marginTop: "-30px" }} />

                                                                    <Text style={{ fontSize: 20, textAlign: "center", width: "calc(100% / 1.2)", paddingTop: 15 }}>Вы еще не ответили ни на один вопрос от пользователей!</Text>
                                                                </div>
                                                            )}
                                                    </div>
                                                )}

                                        </div>
                                    )
                            }
                        </div>
                    ) : (
                            <div>
                                <Spinner size="medium" style={{ marginTop: 20, marginBottom: 20 }} />
                            </div>
                        )}

                </div>
            </div >
        );
    }
}

const itemStyle = {
    flexShrink: 0,
    marginRight: 15,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: 12,
    maxWidth: 100,
    cursor: "pointer"
};

export default QuesUsers;