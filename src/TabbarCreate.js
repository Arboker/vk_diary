import React from 'react';
import { Text, Button, Title } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from "@vkontakte/vk-bridge";
import Icon24Write from '@vkontakte/icons/dist/24/write';

class TabbarCreate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            theme: ""
        }
    }

    componentDidMount = () => {
        let body = document.getElementById('main');
		this.setState({
			theme: body.getAttribute("scheme"),
		})
    }

    render() {
        return (
            <div style={{ marginTop: "-20px" }}>
                <Icon24Write style={{
                    zIndex: 99999, marginBottom: 10, marginTop: 3,
                    backgroundColor: this.state.theme == "space_gray" ? "#2b7ede" : "rgb(70 145 230)",
                    color: "white", cursor: "pointer", borderRadius: 50, padding: 15,
                    boxShadow: "0px 9px 13px -10px #000000, 0px 9px 11px 2px rgba(0,0,0,0)"
                }}
                ></Icon24Write>
            </div>
        );
    }
}

export default TabbarCreate;