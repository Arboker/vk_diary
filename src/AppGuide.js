import React from "react";
import { Text, Button, Panel, PanelHeader, View, PanelHeaderBack, Epic, ModalCard, ModalRoot, Textarea } from '@vkontakte/vkui';
import diary from './img/calendar.png'
import App from "./App";
import Icon28ArrowLeftOutline from '@vkontakte/icons/dist/28/arrow_left_outline';
import bridge from "@vkontakte/vk-bridge";
import imageLogo from './img/logo.jpg'
import screenOne from './img/screen_one.jpg'
import screenTwo from './img/screenTwo.jpg'
import screenThird from './img/screen_third.png'
import screenFourth from './img/fourth.png'

class AppGuide extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePanel: 'welcomeOne',
            history: ['welcomeOne'],
            theme: ""
        }
    }
    componentDidMount = () => {
        const paramsURL = new URLSearchParams(window.location.search);
        bridge.send("VKWebAppInit");

        bridge.subscribe(({ detail: { type, data } }) => {
            if (type === 'VKWebAppUpdateConfig') { // Получаем тему клиента.
                this.setState({
                    theme: data.scheme
                })
            }
        })
            // const requestOptions = {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         username: userID,
            //         avatar: userAvatar,
            //         name: userName
            //     })
            // }
            fetch('https://diary-2212.herokuapp.com/insertuser?'+paramsURL)
                .then(response => response.json())
                .then(data => {
                });

        window.addEventListener('popstate', () => this.goBack());
    }
    goBack = () => {
        var history = this.state.history;

        if (history.length === 1) {  // Если в массиве одно значение:
            bridge.send("VKWebAppClose", { "status": "success" }); // Отправляем bridge на закрытие сервиса.
        } else if (history.length > 1) {  // Если в массиве больше одного значения:

            history.pop();
            this.setState({ activePanel: history[history.length - 1] })
        }
    }
    render() {
        console.log(this.state.history)
        return (
            <View
                id="panel1" activePanel={this.state.activePanel} history={this.state.history}
                onSwipeBack={this.goBack}>
                <Panel id="welcomeOne">
                    <div style={{ fontFamily: "'Fira Sans', sans-serif", marginTop: 100, padding: 25 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "auto" }}>
                            <img src={imageLogo} alt='Image' style={{ width: 150, height: 150, marginBottom: 50, borderRadius: 12 }} />
                            <Text style={{ fontSize: 18, width: "90%", textAlign: "center" }}>Привет! Тебя приветствует приложение "Дневник вопросов".
                            Сейчас я тебе расскажу о главных фишках нашего приложения
                </Text>
                            <Button onClick={() => {
                                window.history.pushState({ panel: "welcomeTwo" }, "welcomeTwo");
                                this.setState({ activePanel: "welcomeTwo", history: [...this.state.history, "welcomeTwo"] })
                            }} size="xl" mode="secondary"
                                style={{
                                    color: "white",
                                    marginTop: 30, backgroundColor: this.state.theme == "space_gray" ? "#2b7ede" : "rgb(70 145 230)",
                                }}>Продолжить</Button>
                        </div>
                    </div>
                </Panel>
                <Panel id="welcomeTwo">
                    <PanelHeader separator={false} left={<Icon28ArrowLeftOutline style={{ cursor: "pointer" }} onClick={() => this.goBack()} />}>
                    </PanelHeader>
                    <div style={{ fontFamily: "'Fira Sans', sans-serif", marginTop: 20, padding: 25 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "auto" }}>
                            <img src={screenOne} alt='Image' style={{
                                width: 300, marginBottom: 50,
                                borderRadius: "20px 20px 0 0", border: this.state.theme == "space_gray" ? "1px solid #303030" : ""
                            }} />
                            <Text style={{ fontSize: 18, width: "90%", textAlign: "center" }}>
                                Отвечайте на вопросы, чтобы понимать, какие у вас на данный момент
                                взгляды или предпочтения
                </Text>
                            <Button onClick={() => { 
                                window.history.pushState({ panel: "welcomeThree" }, "welcomeThree");
                                this.setState({ activePanel: "welcomeThree", history: [...this.state.history, "welcomeThree"] })}} size="xl" mode="secondary"
                                style={{
                                    color: "white",
                                    marginTop: 30, backgroundColor: this.state.theme == "space_gray" ? "#2b7ede" : "rgb(70 145 230)"
                                }}
                            >Продолжить</Button>
                        </div>
                    </div>
                </Panel>
                <Panel id="welcomeThree">
                    <PanelHeader separator={false} left={<Icon28ArrowLeftOutline style={{ cursor: "pointer" }} onClick={() => this.goBack()} />}>
                    </PanelHeader>
                    <div style={{ fontFamily: "'Fira Sans', sans-serif", marginTop: 20, padding: 25 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "auto" }}>
                            <img src={screenTwo} alt='Image' style={{
                                width: 300, marginBottom: 50,
                                borderRadius: "20px 20px 0 0", border: this.state.theme == "space_gray" ? "1px solid #303030" : ""
                            }} />
                            <Text style={{ fontSize: 18, width: "90%", textAlign: "center" }}>
                                Следите за изменениями своих ответов в календаре, чтобы понять, как вы изменились!
                </Text>
                            <Button onClick={() => { 
                                window.history.pushState({ panel: "welcomeFourth" }, "welcomeFourth");
                                this.setState({ activePanel: "welcomeFourth", history: [...this.state.history, "welcomeFourth"] })}} size="xl" mode="secondary"
                                style={{
                                    color: "white",
                                    marginTop: 30, backgroundColor: this.state.theme == "space_gray" ? "#2b7ede" : "rgb(70 145 230)"
                                }}
                            >Продолжить</Button>
                        </div>
                    </div>
                </Panel>
                <Panel id="welcomeFourth">
                    <PanelHeader separator={false} left={<Icon28ArrowLeftOutline style={{ cursor: "pointer" }} onClick={() => this.goBack()} />}>
                    </PanelHeader>
                    <div style={{ fontFamily: "'Fira Sans', sans-serif", marginTop: 20, padding: 25 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "auto" }}>
                            <img src={screenThird} alt='Image' style={{
                                width: 300, marginBottom: 50,
                                borderRadius: "20px 20px 0 0", border: this.state.theme == "space_gray" ? "1px solid #303030" : ""
                            }} />
                            <Text style={{ fontSize: 18, width: "90%", textAlign: "center" }}>
                                Создавайте свои вопросы и следите, как вы на них отвечаете, или поделитесь с друзьями
                </Text>
                            <Button onClick={() => { 
                                window.history.pushState({ panel: "welcomeFifth" }, "welcomeFifth");
                                this.setState({ activePanel: "welcomeFifth", history: [...this.state.history, "welcomeFourth"] })}} size="xl" mode="secondary"
                                style={{
                                    color: "white",
                                    marginTop: 30, backgroundColor: this.state.theme == "space_gray" ? "#2b7ede" : "rgb(70 145 230)"
                                }}
                            >Продолжить</Button>
                        </div>
                    </div>
                </Panel>
                <Panel id="welcomeFifth">
                    <PanelHeader separator={false} left={<Icon28ArrowLeftOutline style={{ cursor: "pointer" }} onClick={() => this.goBack()} />}>
                    </PanelHeader>
                    <div style={{ fontFamily: "'Fira Sans', sans-serif", marginTop: 20, padding: 25 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "auto" }}>
                            <img src={screenFourth} alt='Image' style={{
                                width: 300, marginBottom: 50,
                                borderRadius: "20px 20px 0 0", border: this.state.theme == "space_gray" ? "1px solid #303030" : ""
                            }} />
                            <Text style={{ fontSize: 18, width: "90%", textAlign: "center" }}>
                                Отвечайте на рандомные вопросы людей в вашей ленте. Также следите за
                                созданными и отвеченными вами вопросами
                </Text>
                            <Button onClick={() => this.setState({ activePanel: "app", history: [] })} size="xl" mode="secondary"
                                style={{
                                    color: "white",
                                    marginTop: 30, backgroundColor: this.state.theme == "space_gray" ? "#2b7ede" : "rgb(70 145 230)"
                                }}
                            >Продолжить</Button>
                        </div>
                    </div>
                </Panel>
                <Panel id="app">
                    <App />
                </Panel>
            </View>
        )
    }

}

export default AppGuide;