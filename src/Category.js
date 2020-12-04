import React from 'react';
import { Text, Title, Button, View, Spinner } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from "@vkontakte/vk-bridge";
import diary from './img/calendar.png'
import category from './img/category.png'
import Icon24Add from '@vkontakte/icons/dist/24/add';
import error from './img/error.png'

import samoanaliz from './img/category/samoanaliz.jpeg'
import mechti from './img/category/mechti.jpeg'
import perezhivania from './img/category/perezhivania.jpeg'
import camochustvie from './img/category/camochustvie.jpeg'

class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme
        }
    }

    render() {
        return (
            <div style={{ padding: 10, fontFamily: "'Fira Sans', sans-serif" }}>
                <div onClick={() => this.props.goCategory("Самоанализ")}>
                    <img src={samoanaliz} alt='Image' style={{
                        width: "100%", height: 160, filter: "brightness(50%)",
                        borderRadius: 12
                    }} />
                    <div style={{ position: "absolute", zIndex: 9, marginTop: "-50px", paddingLeft: 15 }}>
                        <Text style={{ fontSize: 28, color: "white" }}>Самоанализ</Text>
                    </div>
                </div>
                <div onClick={() => this.props.goCategory("Мечты")}
                    style={{ paddingTop: 10 }}>
                    <img src={mechti} alt='Image' style={{
                        width: "100%", height: 160, filter: "brightness(50%)",
                        borderRadius: 12
                    }} />
                    <div style={{ position: "absolute", zIndex: 9, marginTop: "-50px", paddingLeft: 15 }}>
                        <Text style={{ fontSize: 28, color: "white" }}>Мечты</Text>
                    </div>
                </div>
                <div onClick={() => this.props.goCategory("Переживания")}
                    style={{ paddingTop: 10 }}>
                    <img src={perezhivania} alt='Image' style={{
                        width: "100%", height: 160, filter: "brightness(50%)",
                        borderRadius: 12
                    }} />
                    <div style={{ position: "absolute", zIndex: 9, marginTop: "-50px", paddingLeft: 15 }}>
                        <Text style={{ fontSize: 28, color: "white" }}>Переживания</Text>
                    </div>
                </div>
                <div onClick={() => this.props.goCategory("Самочувствие")}
                style={{ paddingTop: 10 }}>
                    <img src={camochustvie} alt='Image' style={{
                        width: "100%", height: 160, filter: "brightness(50%)",
                        borderRadius: 12
                    }} />
                    <div style={{ position: "absolute", zIndex: 9, marginTop: "-50px", paddingLeft: 15 }}>
                        <Text style={{ fontSize: 28, color: "white" }}>Самочувствие</Text>
                    </div>
                </div>
            </div>
        );
    }
}

export default Main;