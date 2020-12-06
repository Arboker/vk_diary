import React from 'react';
import { Text, Button, FormLayout, Input, Textarea, Spinner } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from "@vkontakte/vk-bridge";
import Icon24Write from '@vkontakte/icons/dist/24/write';

class CreateQuestion extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            error: "",
            id: "",
            answer: "",
            loading: false
        }
    }

    handleChange = event => {
        this.setState({ title: event.target.value })
    }

    createQuestion = () => {
        const paramsURL = new URLSearchParams(window.location.search);
        var ranges = [
            '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
            '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
            '\ud83d[\ude80-\udeff]'  // U+1F680 to U+1F6FF
          ];

          var textTitle = this.state.title;
          textTitle = textTitle.replace(/\s/g, '');
          textTitle = textTitle.replace(new RegExp(ranges.join('|'), 'g'), '');
          textTitle = textTitle.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '');

          console.log(textTitle)
        if (textTitle.length != 0) {
            var error = "";
            if (this.state.title.length > 150 && this.state.answer.length > 999) {
                error = "Вопрос и ответ слишком длинные. Максимум 150 и 999 символов!"
            }
            else if (this.state.title.length > 150) {
                error = "Вопрос слишком длинный. Максимум 150 символов!";
            }
            else if (this.state.answer.length > 999) {
                error = "Ответ слишком длинный. Максимум 999 символов!"
            }

            console.log(error)

            if (error == "") {
                this.props.addQuestionSpinner()
                bridge.send("VKWebAppGetUserInfo", {}).then(event => {
                    this.setState({
                        id: event.id
                    })

                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            question: this.state.title, answer: this.state.answer
                        })
                    };
                    fetch('https://diary-2212.herokuapp.com/createquestion?' + paramsURL, requestOptions)
                        .then(response => response.json())
                        .then(data => {
                            console.log(data)
                            this.props.removeSpinner();
                            if (data == "Dublicate") {
                                this.props.dublicate("Вы уже создавали данный вопрос!")
                            }
                            else if (data == "Maximum limit") {
                                this.props.dublicate("Вы превысили лимит по созданию вопросов!")
                            }
                            else {
                                this.setState({ error: "", title: "", answer: "", loading: false });
                                this.props.goQuestion()
                            }
                        });
                })

            }
            else {
                this.props.errorModal(error)
            }
        }
        else {
            this.props.errorModal("Вы не создали вопрос!")
        }
    }

    answer = event => {
        this.setState({ answer: event.target.value })
    }

    render() {
        return (
            <div style={{ fontFamily: "'Fira Sans', sans-serif" }}>
                <div style={{ padding: 10 }}>
                    <div style={{ paddingBottom: 20 }}>
                        <div style={{ padding: "2px 0 8px", display: "flex", justifyContent: "space-between" }}>
                            <Text style={{ color: "var(--text_secondary)", fontSize: 15 }}>Вопрос</Text>
                            <Text style={{
                                color: this.state.title.length > 150 ? "rgb(234, 67, 67)" : "var(--text_secondary)", fontSize: 15
                            }}>{this.state.title.length}/150</Text>
                        </div>
                        <Input onChange={this.handleChange} />
                    </div>
                    <div style={{ paddingBottom: 20 }}>
                        <div style={{ padding: "2px 0 8px", display: "flex", justifyContent: "space-between" }}>
                            <Text style={{ color: "var(--text_secondary)", fontSize: 15 }}>Ответить на вопрос</Text>
                            <Text style={{
                                color: this.state.answer.length > 999 ? "rgb(234, 67, 67)" : "var(--text_secondary)", fontSize: 15
                            }}>{this.state.answer.length}/999</Text>
                        </div>
                        <Textarea onChange={this.answer} />
                    </div>
                    <Button onClick={() => this.createQuestion()} size="xl">Создать вопрос</Button>
                </div>
            </div>
        );
    }
}

export default CreateQuestion;