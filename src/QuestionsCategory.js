import React from 'react';
import { Text, Title, Spinner } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from "@vkontakte/vk-bridge";
import diary from './img/calendar.png'
import category from './img/category.png'
import Icon24Add from '@vkontakte/icons/dist/24/add';
import error from './img/error.png'

class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
            data: [],
            loaded: false
        }
    }

    changeQuestionScreen = (isNew, nameQuestion, answer, creator, idQuestion) => {
        window.history.pushState({ panel: "question" }, "question")
        this.props.changeQuestion(isNew, nameQuestion, answer, creator, idQuestion);
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

    componentDidMount = () => {
        const paramsURL = new URLSearchParams(window.location.search);
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category: this.props.category })
            };

            fetch('https://diary-2212.herokuapp.com/questionbycategory?'+paramsURL, requestOptions)
                .then(response => response.json())
                .then(data => { this.setState({ data: data, loaded: true }); });
    }

    render() {

        return (
            <div style={{ padding: "0px 10px 10px", fontFamily: "'Fira Sans', sans-serif" }}>
                {this.state.loaded ? (
                    <div>
                        {this.state.data.map(item => {
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
                            var day, month;
                            if (item.date) {
                                const date = item.date;
                                month = date.slice(0, -3).substring(5).replace(/^0+/, '');
                                day = date.substring(8).replace(/^0+/, '');
                            }
                            return (
                                <div style={{ filter: !item.isAnswered ? "brightness(0.8)" : "" }} key={item.id}>
                                    {!item.isAnswered ? (
                                        <div style={{
                                            background: this.props.theme == "space_gray" ? "rgb(234 67 67)" : '#ff5e5e',
                                            borderRadius: "6px 0 0 6px", padding: 5, height: 20, float: "right",
                                            marginBottom: 10, marginLeft: 10
                                        }}>
                                            <Text style={{color: "white"}}>Не отвечено</Text>
                                        </div>
                                    ) : (
                                            <div></div>
                                        )}
                                    <div
                                        onClick={() => this.changeQuestionScreen(!item.isAnswered, item.question, item.answer, "", item.id)}
                                        style={{
                                            marginTop: 15, zIndex: 9, boxShadow: this.props.theme == "space_gray" ? '0 0px 10px 0 rgb(74 74 74)' : '0 0px 10px 0 rgba(16, 36, 94, 0.2)',
                                            borderRadius: 6
                                        }}>

                                        <div style={{
                                            fontFamily: "'Fira Sans', sans-serif",
                                        }}>
                                            <div style={{ padding: "15px 10px", display: item.isAnswered ? "flex" : "" }}>
                                                {item.isAnswered ? (
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
                                                ) : (
                                                        <div>
                                                        </div>
                                                    )}
                                                <div>
                                                    <Text style={{ fontSize: 20, marginBottom: item.isAnswered ? 12 : 0 }}>{item.question}</Text>
                                                    <Text style={{ fontSize: 17, 
                                                        color: this.props.theme == "space_gray" ? "rgb(173 171 171)" : "#5e5e5e", wordBreak: "break-all" }}>{item.answer != undefined ? this.text_truncate(item.answer) : ""}</Text>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                        <div>
                            <Spinner size="medium" style={{ marginTop: 20 }} />
                        </div>
                    )}
            </div>
        );
    }
}

export default Main;