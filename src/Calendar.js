import React from 'react';
import { Spinner, Text, Title } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from "@vkontakte/vk-bridge";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'

class CalendarScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            questions: [],
            loading: true,
            id: "",
            name: "",
            avatar: "",
            loadedBridge: false
        }
    }

    componentDidMount = () => {
        bridge.send("VKWebAppGetUserInfo", {}).then(event => {
            this.setState({
                id: event.id,
                name: event.first_name + " " + event.last_name,
                avatar: event.photo_100,
                loadedBridge: true
            })
            const date = new Date();
            const dateCal = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2);    
            this.getDataByDate(dateCal, event.id);
        })
    }

    changeQuestionScreen = (isNew, nameQuestion, answer, creator, idQuestion) => {
        window.history.pushState({ panel: "question" }, "question")
        this.props.changeQuestion(isNew, nameQuestion, answer, creator, idQuestion);
    }

    getDataByDate = (date, id) => {
        const paramsURL = new URLSearchParams(window.location.search);
        bridge.send("VKWebAppGetUserInfo", {}).then(event => {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: date })
            };
            fetch('https://diary-2212.herokuapp.com/questionbydate?'+paramsURL, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data == "No") {
                        this.setState({ loading: false, questions: [] });
                    } else {
                        this.setState({ questions: data, loading: false });
                    }
                });
            })
    }

    onChange = date => {
        this.setState({ date: date, loading: true })
        const dateCal = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2);
        this.getDataByDate(dateCal);
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
        const questionsObject = this.state.questions;
        const date = this.state.date;
        const dateText = ("0" + (date.getDate())).slice(-2) + "." + ("0" + (date.getMonth() + 1)).slice(-2) + "." + date.getFullYear();
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
        if (this.props.theme == "space_gray") {
            var styles = `
        .react-calendar { background:#303030 }
        .react-calendar__month-view__days__day { color: white }
        .react-calendar__month-view__days__day--weekend { color: rgb(234 67 67) }
        .react-calendar__month-view__days__day--neighboringMonth { color: #aba9a9 }
        .react-calendar__navigation__arrow, .react-calendar__navigation__label__labelText { color: white }
        .react-calendar__tile--now { background: rgb(234 67 67) !important }
        .react-calendar__tile--active { color: #2977d2 }
        .react-calendar__tile--active { color: white !important }
        .react-calendar__tile:enabled:hover, .react-calendar__tile:enabled:focus { background: rgb(43, 126, 222) }
        .react-calendar__navigation button:enabled:hover, .react-calendar__navigation button:enabled:focus { background: #252525 }
        .react-calendar__navigation button[disabled] { background: #252525 }
        .react-calendar__year-view .react-calendar__tile, .react-calendar__decade-view .react-calendar__tile, .react-calendar__century-view .react-calendar__tile {
            color: white;
        }
        `;
        }
        return (
            <div style={{ padding: 10 }}>
                {this.props.theme == "space_gray" ? (
                    <style>
                        { styles}
                    </style>
                ) : (
                        <div></div>
                    )}

                <div style={{
                    display: "flex",
                    justifyContent: 'center', marginTop: 20, fontFamily: "'Fira Sans', sans-serif"
                }}>
                    <Calendar
                        onChange={this.onChange}
                        value={this.state.date}
                        locale="RU"
                    />

                </div>

                <Title level="1" weight="bold" style={{
                    marginTop: 35, paddingBottom: 10, fontFamily: "'Fira Sans', sans-serif"
                }}>Вопросы за {this.state.date.getDate() + monthNames[date.getMonth()]}</Title>

                {this.state.date < new Date() ? (
                    <div style={{ fontFamily: "'Fira Sans', sans-serif" }}>
                        {this.state.loading ? (
                            <div>
                                <Spinner size="medium" style={{ marginTop: 20 }} />
                            </div>
                        ) : (
                                <div>
                                    {Object.keys(questionsObject).length === 0 ? (
                                        <div>
                                            <Text style={{ fontSize: 18, marginTop: 10 }}>Вы не ответили ни на один вопрос в
                                            этот день!</Text>
                                        </div>
                                    ) : (

                                            <div>
                                                {questionsObject.map(item => {
                                                    return (
                                                        <div>

                                                            <div
                                                                onClick={() => this.changeQuestionScreen(false, item.question, item.answer, "", item.id)}
                                                                style={{
                                                                    marginTop: 15,
                                                                    zIndex: 9,
                                                                    boxShadow: this.props.theme == "space_gray" ? '0 0px 10px 0 rgb(74 74 74)' : '0 0px 10px 0 rgba(16, 36, 94, 0.2)', borderRadius: 6,
                                                                    padding: "15px 10px", cursor: "pointer"
                                                                }}>
                                                                <div>
                                                                    <Text style={{
                                                                        fontSize: 18,
                                                                        marginBottom: 5,
                                                                    }}>{item.question}</Text>
                                                                    <Text style={{
                                                                        fontSize: 17,
                                                                        color: this.props.theme == "space_gray" ? "rgb(173 171 171)" : "#5e5e5e"
                                                                    }}>{this.text_truncate(item.answer)}</Text>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    )
                                                })}

                                            </div>

                                        )}
                                </div>
                            )}
                    </div>
                ) : (
                        <div>
                            <Text style={{ fontSize: 18, marginTop: 10 }}>Вопросы будут вас ждать в этот день!</Text>
                        </div>
                    )}


            </div>
        );
    }
}

export default CalendarScreen;