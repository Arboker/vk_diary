import React from 'react';
import {
	Tabbar, TabbarItem, Panel, PanelHeader, View, PanelHeaderBack, Epic,
	ModalCard, ModalRoot, Textarea, ActionSheet, ActionSheetItem, ScreenSpinner, Alert, Text,
	Button
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import error from './img/error.png'

import Question from './Question'
import Main from './Main'
import bridge from "@vkontakte/vk-bridge";
import Calendar from './Calendar'
import User from './User'
import CreateQuestion from './CreateQuestion'
import Icon24Add from '@vkontakte/icons/dist/24/add';
import TabbarCreate from './TabbarCreate'
import QuesUsers from './QuesUsers'
import Category from './Category'
import QuestionsCategory from './QuestionsCategory'

import Icon28HomeOutline from '@vkontakte/icons/dist/28/home_outline';
import Icon24UserOutline from '@vkontakte/icons/dist/24/user_outline';
import Icon56ErrorOutline from '@vkontakte/icons/dist/56/error_outline';
import Icon28NewsfeedOutline from '@vkontakte/icons/dist/28/newsfeed_outline';
import Icon28EditOutline from '@vkontakte/icons/dist/28/edit_outline';
import Icon28DeleteOutlineAndroid from '@vkontakte/icons/dist/28/delete_outline_android';

const MODAL_ERROR = "error";
const MODAL_QUESTION = "question";
const MODAL_CHANGE = "answer_change";
const MODAL_REPORT = "report";

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activePanel: 'panel1',
			activeStory: 'panel1',
			history: ["panel1"],
			isNewNow: '',
			answered: [],
			questionTitle: '',
			answerTitle: '',
			loading: true,
			id: '',
			name: '',
			avatar: '',
			activeModal: null,
			modalHistory: [],
			allowToGoBack: true,
			dataUser: [],
			loadingUser: true,
			questionText: "",
			loadDataAgain: false,
			question: "",
			idQuestion: "",
			userId: "",
			userName: "",
			userPicture: "",
			userSex: "",
			hrefInsert: "",
			theme: "",
			loadingAnswer: true,
			category: "",
			creator: "",
			questionId: "",
			loadedCreator: false,
			isOpenedToClose: false,
			answerID: "",
			newAnswer: "",
			popout: null,
			canLoadQuestion: false,
			reportText: "",
			popoutAlert: null,
			errorMessage: "",
			popoutSpinner: null,
			internet: false,
			isReadyToGoBack: true,
			isFromCategory: false,
			adHasShown: false,
			addHistory: ["panel1"],
			myQuestion: false,
		}
		this.modalBack = () => {
			this.setActiveModal(this.state.modalHistory[this.state.modalHistory.length - 2]);
		};
		this.openDefault = this.openDefault.bind(this);
		this.openQuestion = this.openQuestion.bind(this);
		this.closePopout = this.closePopout.bind(this);
	}

	addQuestionSpinner = () => {
		this.setState({ popout: <ScreenSpinner /> });
	}

	removeSpinner = () => {
		this.setState({ popout: null });
	}

	componentDidMount = () => {
		const paramsURL = new URLSearchParams(window.location.search);

		fetch('https://diary-2212.herokuapp.com/isnew?' + paramsURL)
			.then(response => response.json())
			.then(data => {
				if (data.toString() == "true") {
					fetch('https://diary-2212.herokuapp.com/insertuser?' + paramsURL)
						.then(response => response.json())
						.then(data => {
						});
					bridge.send("VKWebAppStorageSet", { "key": "userExists", "value": "true" });
					this.setState({ loading: false });
				}
				else {

				}
			});

		this.handleConnectionChange();

		let body = document.getElementById('main');
		this.setState({
			theme: body.getAttribute("scheme"),
		})
		this.checkForHash();

		bridge.send("VKWebAppGetUserInfo", {}).then(event => {
			this.setState({
				id: event.id,
				name: event.first_name + " " + event.last_name,
				avatar: event.photo_100,
				canLoadQuestion: true
			})
		})

		window.addEventListener('popstate', () => this.goBack());

		this.getAllAnswers();
	}

	closePopout() {
		this.setState({ popout: null });
	}

	openQuestion(answerID) {
		this.setState({
			popout:
				<ActionSheet onClose={() => this.setState({ popout: null })}>
					<ActionSheetItem autoclose before={<Icon28EditOutline />}
						onClick={() => {
							this.setActiveModal(MODAL_CHANGE);
							this.setState({
								allowToGoBack: false,
								answerID: answerID,
								history: [...this.state.history, "modal_question"]
							})
						}}
					>
						Редактировать ответ
					</ActionSheetItem>
					<ActionSheetItem autoclose mode="destructive" before={<Icon28DeleteOutlineAndroid />}
						onClick={() => this.deleteAnswer(answerID)}
					>
						Удалить ответ
        </ActionSheetItem>
				</ActionSheet>
		});
	}

	checkForIsNew = () => {
		return this.state.isNewNow
	}

	deleteAnswer = id => {
		this.handleConnectionChange();
		const paramsURL = new URLSearchParams(window.location.search);
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				answerID: id
			})
		};
		if (this.state.hrefInsert == "insertanswer") {
			fetch('https://diary-2212.herokuapp.com/deleteanswer?' + paramsURL, requestOptions)
				.then(response => response.json())
				.then(data => {
					this.getAllAnswers();
					this.setState({
						loadingAnswer: true,
						loading: true,
						loadDataAgain: true
					})
				})
		}
		else {
			fetch('https://diary-2212.herokuapp.com/deleteanswerusers?' + paramsURL, requestOptions)
				.then(response => response.json())
				.then(data => {
					this.setState({
						loadingAnswer: true
					})
				})
		}

	}

	getAllAnswers = () => {
		const paramsURL = new URLSearchParams(window.location.search);
		fetch('https://diary-2212.herokuapp.com/answered?' + paramsURL)
			.then(response => response.json())
			.then(data => {
				if (data != "No questions answered") {
					this.setState({ answered: data, loading: false });
				}
				else {
					this.setState({ loading: false });
				}
			});
	}

	goBack = () => {
		this.handleConnectionChange();
		this.setActiveModal(null);

		if (this.state.popout == null) {
			var history = this.state.history;

			if (history.length === 1) {  // Если в массиве одно значение:
				bridge.send("VKWebAppClose", { "status": "success" }); // Отправляем bridge на закрытие сервиса.
			} else if (history.length > 1) {  // Если в массиве больше одного значения:	
				const tabsName = ['panel1', 'CreateQuestion', 'QuesUsers'];
				history.pop();
				if (tabsName.includes(history[history.length - 1])) {
					this.setState({ activePanel: history[history.length - 1], activeStory: history[history.length - 1], isReadyToGoBack: false })
				}
				else {
					this.setState({ activePanel: history[history.length - 1], isReadyToGoBack: false })
				}
			}
		}
		else {
			this.setState({ popout: null })
		}
	}

	onStoryChange = e => {
		this.handleConnectionChange()
		const tabsName = ['panel1', 'CreateQuestion', 'QuesUsers'];
		const tabName = e.currentTarget.dataset.story;
		const history = this.state.history;

		var a = history.filter(item => tabsName.includes(item));
		a = a.concat(tabName)

		if (a[a.length - 2] == tabName) {
			a.pop();
		}

		console.log(a)
		window.history.pushState({ panel: tabName }, tabName);
		this.setState({
			activeStory: tabName, activePanel: tabName,
			canLoadQuestion: true, history: a
		})
	}

	setActiveModal(activeModal, state) {
		if (state) {
			const history = this.state.history
			history.pop();
			this.setState({
				allowToGoBack: true,
				activePanel: history[history.length - 1],
				isOpenedToClose: false,
			});
		}
		activeModal = activeModal || null;
		let modalHistory = this.state.modalHistory ? [...this.state.modalHistory] : [];

		if (activeModal === null) {
			modalHistory = [];
		} else if (modalHistory.indexOf(activeModal) !== -1) {
			modalHistory = modalHistory.splice(0, modalHistory.indexOf(activeModal) + 1);
		} else {
			modalHistory.push(activeModal);
		}

		this.setState({
			activeModal,
			modalHistory
		});
	};

	handleChangeText = event => {
		this.setState({ questionText: event.target.value })
	}

	handleChangeAnswer = event => {
		this.setState({ newAnswer: event.target.value })
	}

	handleReport = event => {
		this.setState({ reportText: event.target.value })
	}

	insertAnswer = () => {
		this.handleConnectionChange();
		if (this.state.questionText != undefined) {
			if (this.state.questionText.replace(/\s/g, '').length != 0) {

				const paramsURL = new URLSearchParams(window.location.search);
				const date = new Date();
				const dateQuestion = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2);
				var requestOptions;
				if (this.state.hrefInsert == "insertanswer") {
					requestOptions = {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							question: this.state.question.toString(),
							answer: this.state.questionText, date: dateQuestion
						})
					};
				}
				else {
					requestOptions = {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							question: this.state.question.toString(),
							answer: this.state.questionText, date: dateQuestion, creator: this.state.creator
						})
					};
				}
				fetch('https://diary-2212.herokuapp.com/' + this.state.hrefInsert + "?" + paramsURL, requestOptions)
					.then(response => response.json())
					.then(data => {
						if (data == "Limit") {
							this.openDefault("Ошибка", "Во избежание флуда, ответьте ещё раз!")
						}
						this.setState({
							loadingAnswer: true,
							questionText: ""
						})
					})
			}
			if (this.state.questionText.replace(/\s/g, '').length > 999) {
				this.openDefault("Ошибка", "Максимальная длина ответа 999 символов!");
			}
		}
	}

	changeAnswer = () => {
		this.handleConnectionChange();
		const paramsURL = new URLSearchParams(window.location.search);
		if (this.state.newAnswer.replace(/\s/g, '').length > 999) {
			this.openDefault("Ошибка", "Максимальная длина ответа 999 символов!");
		}
		else {
			if (this.state.newAnswer.replace(/\s/g, '').length != 0) {
				const requestOptions = {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						answerID: this.state.answerID, newAnswer: this.state.newAnswer
					})
				};
				if (this.state.hrefInsert == "insertanswer") {
					fetch('https://diary-2212.herokuapp.com/updateanswer?' + paramsURL, requestOptions)
						.then(response => response.json())
						.then(data => {
							this.getAllAnswers();
							this.setState({
								loadingAnswer: true,
								newAnswer: "",
								loading: true
							})
						})
				}
				else {
					fetch('https://diary-2212.herokuapp.com/updateanswerusers?' + paramsURL, requestOptions)
						.then(response => response.json())
						.then(data => {
							this.setState({
								loadingAnswer: true
							})
						})
				}
			}
		}
	}

	checkForHash = () => {

		const paramsURL = new URLSearchParams(window.location.search);
		const hash = window.location.hash.replace('#', '')
		const first = hash.charAt(0)
		if (first === "q") {
			let question_id = hash.slice(1)
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ question: question_id })
			};
			fetch("https://diary-2212.herokuapp.com/questionbyidadmin?" + paramsURL, requestOptions)
				.then(response => response.json())
				.then(data => data.map(item => {
					this.setState({

						activePanel: "question", isNewNow: false, questionTitle: item.question, hrefInsert: 'insertanswer',
						answerTitle: "", history: [...this.state.history, "question"], loadingAnswer: true,
						questionId: question_id,
					})
				}
				)
				)
		}
		if (first === "u") {
			let question_id = hash.slice(1)
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ question: question_id })
			};
			fetch("https://diary-2212.herokuapp.com/questionbyiduser?" + paramsURL, requestOptions)
				.then(response => response.json())
				.then(data => data.map(item => {
					this.setState({
						loadedCreator: true,
						activePanel: "question", isNewNow: false, questionTitle: item.question, hrefInsert: 'insertanswerusers',
						creator: item.creator, questionId: question_id,
						answerTitle: "", history: [...this.state.history, "question"], loadingAnswer: true
					})
				}
				)
				)
		}

	}

	reportQuestion = () => {
		this.handleConnectionChange();
		if (this.state.reportText.replace(/\s/g, '').length > 999) {
			this.openDefault("Принято", "Жалоба слишком длинная! Максимум 999 символов");
		}
		else {
			if (this.state.reportText.replace(/\s/g, '').length != 0) {
				const paramsURL = new URLSearchParams(window.location.search);
				let body = document.getElementById('main');
				const requestOptions = {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ questionID: this.state.idQuestion, text: this.state.reportText })
				};
				fetch("https://diary-2212.herokuapp.com/complaint?" + paramsURL, requestOptions)
					.then(response => response.json())
					.then(data => data.map(item => {
						if (item == 'Already Reported') {
							this.openDefault("Ошибка", "Извините, вы уже пожаловались на данный вопрос!")
						}
						else {
							this.openDefault("Принято", "Спасибо, ваша жалоба находится на рассмотрении!")
						}
					})
					)
			}
		}
	}

	openDefault(title, text) {
		this.setState({
			popout:
				<Alert
					actions={[{
						title: 'Хорошо',
						autoclose: true,
						mode: 'cancel'
					}]}
					onClose={this.closePopout}
				>
					<h2>{title}</h2>
					<p>{text}</p>
				</Alert>
		});
	}

	handleConnectionChange = () => {
		this.setState({
			internet: window.navigator.onLine
		})
	}

	changeAdShown = () => {
		this.setState({
			adHasShown: true
		})
	}

	render() {
		// if (!this.state.adHasShown) {
		// 	if (this.state.addHistory.length === 1) {
		// 		bridge
		//   .send("VKWebAppShowNativeAds", { ad_format: "interstitial" })
		//   .then(data => console.log(JSON.stringify(data.result)))
		//   .catch(error => console.log(error));
		//   this.changeAdShown()
		// }
		// }
		const history = this.state.history;
		const modal = (
			<ModalRoot
				activeModal={this.state.activeModal}
				onClose={this.modalBack}
			>
				<ModalCard
					id={MODAL_ERROR}
					onClose={() => {
						this.setActiveModal(null);
						this.setState({
							allowToGoBack: true
						})
					}}
					icon={<Icon56ErrorOutline />}
					header="Ошибка"
					caption={this.state.errorMessage}
					actions={[{
						title: 'Хорошо',
						mode: 'primary',
						action: () => {
							this.setActiveModal(null);
							this.setState({
								allowToGoBack: true,
							})

						}
					}]}
				>
				</ModalCard>

				<ModalCard
					id={MODAL_QUESTION}
					onClose={() => {
						this.setActiveModal(null, true);
					}}
					header="Добавить ответ"
					caption={<Textarea style={{ marginTop: 15 }} top="" placeholder="" onChange={this.handleChangeText} />}
					actions={[{
						title: 'Ответить',
						mode: 'primary',
						action: () => {
							this.insertAnswer();
							this.setActiveModal(null);
							history.pop();
							this.setState({
								allowToGoBack: true,
								loadDataAgain: true,
							})
						}
					}]}
				>
				</ModalCard>
				<ModalCard
					id={MODAL_CHANGE}
					onClose={() => {
						this.setActiveModal(null, true);
					}}
					header="Изменить ответ"
					caption={<Textarea style={{ marginTop: 15 }} top="" defaultValue={this.state.newAnswer} onChange={this.handleChangeAnswer} />}
					actions={[{
						title: 'Ответить',
						mode: 'primary',
						action: () => {
							this.changeAnswer()
							this.setActiveModal(null);
							history.pop();
							this.setState({
								allowToGoBack: true,
								loadDataAgain: true,
								loading: true
							}); this.getAllAnswers();
						}
					}]}
				>
				</ModalCard>
				<ModalCard
					id={MODAL_REPORT}
					onClose={() => {
						this.setActiveModal(null, true);
					}}
					header="Что вас не устраивает в вопросе?"
					caption={<Textarea style={{ marginTop: 15 }} top="" onChange={this.handleReport} />}
					actions={[{
						title: 'Пожаловаться',
						mode: 'primary',
						action: () => {
							this.reportQuestion()
							this.setActiveModal(null);
							history.pop();
						}
					}]}
				>
				</ModalCard>

			</ModalRoot>

		);

		return (
			<div>
				{this.state.internet ? (
					<Epic activeStory={this.state.activeStory} tabbar={
						< Tabbar >
							<TabbarItem
								onClick={this.onStoryChange}
								selected={this.state.activeStory === 'panel1'}
								data-story="panel1"
							><Icon28HomeOutline width={24} height={24} /></TabbarItem>
							<TabbarItem
								onClick={this.onStoryChange}
								selected={this.state.activeStory === 'CreateQuestion'}
								data-story="CreateQuestion"
							><TabbarCreate /></TabbarItem>
							<TabbarItem
								onClick={this.onStoryChange}
								selected={this.state.activeStory === 'QuesUsers'}
								data-story="QuesUsers"
							><Icon28NewsfeedOutline width={24} height={24} /></TabbarItem>
						</Tabbar>
					}>


						<View
							id="panel1" activePanel={this.state.activePanel} history={this.state.history}
							onSwipeBack={this.goBack}
							modal={modal} popout={this.state.popout}
						>

							<Panel id="panel1">
								<PanelHeader>Главная</PanelHeader>
								<Main changeQuestion={(isNew, name, answer, creator, questionId) => {
									this.handleConnectionChange();
									window.history.pushState({ panel: "question" }, "question");
									this.setState({
										activePanel: "question", isNewNow: isNew, questionTitle: name, hrefInsert: 'insertanswer',
										answerTitle: answer, history: [...this.state.history, "question"], loadingAnswer: true,
										questionId: questionId, isFromCategory: false
									})
								}}
									theme={this.state.theme}
									loading={this.state.loading}
									answered={this.state.answered}
									id={this.state.id}
									canLoadQuestion={this.state.canLoadQuestion}
									changeLoading={() => this.setState({ canLoadQuestion: false })}
									changeScreenApp={(screen) => this.setState({ activePanel: screen, history: [...this.state.history, screen] })}
								/>
							</Panel>

							<Panel id="category">
								<PanelHeader separator={false} left={<PanelHeaderBack style={{ cursor: "pointer" }} onClick={() => this.goBack()} />}>
									Категории
</PanelHeader>

								<Category
									theme={this.state.theme}
									goCategory={(category) => {
										this.handleConnectionChange()
										window.history.pushState({ panel: "questionsCategory" }, "questionsCategory");
										this.setState({
											activePanel: "questionsCategory", category: category,
											history: [...this.state.history, "questionsCategory"]
										})
									}}
								/>
							</Panel>


							<Panel id="calendar">
								<PanelHeader separator={false} left={<PanelHeaderBack style={{ cursor: "pointer" }} onClick={() => this.goBack()} />}>
									Календарь
			  </PanelHeader>

								<Calendar
									id={this.state.id}
									theme={this.state.theme}
									changeQuestion={(isNew, name, answer, creator, questionId) => {
										this.handleConnectionChange()
										window.history.pushState({ panel: "question" }, "question");
										this.setState({
											activePanel: "question", isNewNow: isNew, questionTitle: name, hrefInsert: 'insertanswer',
											answerTitle: answer, history: [...this.state.history, "question"], loadingAnswer: true,
											questionId: questionId, isFromCategory: false
										})
									}}
								/>
							</Panel>



							<Panel id="questionsCategory">
								<PanelHeader separator={false} left={<PanelHeaderBack style={{ cursor: "pointer" }} onClick={() => this.goBack()} />}>
									{this.state.category}
								</PanelHeader>

								<QuestionsCategory
									category={this.state.category}
									theme={this.state.theme}
									changeQuestion={(isNew, name, answer, creator, questionId) => {
										this.handleConnectionChange()
										window.history.pushState({ panel: "question" }, "question");
										this.setState({
											activePanel: "question", isNewNow: isNew, questionTitle: name, hrefInsert: 'insertanswer',
											answerTitle: answer, history: [...this.state.history, "question"], loadingAnswer: true,
											questionId: questionId,
											isFromCategory: true
										})
									}}
								/>
							</Panel>

							<Panel id="question">
								<PanelHeader separator={false} left={<PanelHeaderBack style={{ cursor: "pointer" }} onClick={() => this.goBack()} />}>
									Вопрос
			  </PanelHeader>

								<Question
									id={this.state.id}
									isFromCategory={this.state.isFromCategory}
									title={this.state.questionTitle}
									answer={this.state.answerTitle}
									idQuestion={this.state.idQuestion}
									loadDataAgain={this.state.loadDataAgain}
									hrefInsert={this.state.hrefInsert}
									loadingAnswer={this.state.loadingAnswer}
									theme={this.state.theme}
									creator={this.state.creator}
									loadedCreator={this.state.loadedCreator}
									questionId={this.state.questionId}
									updateAnswer={(answerID, answer) => {
										this.openQuestion(answerID, answer)
										this.setState({
											newAnswer: answer
										})
									}}
									changeProps={() => this.setState({
										loadingAnswer: false
									})}
									questionModal={(question) => {
										this.setActiveModal(MODAL_QUESTION);
										this.setState({
											allowToGoBack: false,
											question: question,
											history: [...this.state.history, "modal_question"]
										})
									}}
									openDefault={(title, error) => this.openDefault(title, error)}
									isNew={this.checkForIsNew()}
									changeToMain={(state) => {
										this.handleConnectionChange();
										const history = this.state.history;
										if (state) {
											history.pop();
											history.pop();
											history.pop();
											this.setState({ activePanel: history[history.length - 1], activeStory: history[history.length - 1], loading: true, isFromCategory: false });
										}
										else {
											history.pop();
											this.setState({ activePanel: history[history.length - 1], activeStory: history[history.length - 1], loading: true, isFromCategory: false });
										}
										this.getAllAnswers();
									}}
								/>
							</Panel>

						</View>

						<View id="QuesUsers" activePanel={this.state.activePanel}
							modal={modal} popout={this.state.popout}
						>

							<Panel id="QuesUsers">
								<PanelHeader>Лента</PanelHeader>
								<QuesUsers
									theme={this.state.theme}
									changeQuestion={(isNew, name, answer, creator, questionId, myQuestion) => {
										this.handleConnectionChange()
										window.history.pushState({ panel: "question" }, "question");
										this.setState({
											activePanel: "question", isNewNow: isNew, questionTitle: name, hrefInsert: 'insertanswerusers',
											answerTitle: answer, history: [...this.state.history, "question"], loadingAnswer: true,
											creator: creator, idQuestion: questionId, myQuestion: myQuestion
										})
									}}
									changeUser={(id, name, avatar, sex) => {
										this.handleConnectionChange()
										window.history.pushState({ panel: "User" }, "User");
										this.setState({
											activePanel: "User", userId: id, userName: name, userPicture: avatar,
											userSex: sex, history: [...this.state.history, "User"]
										})
									}}
									name={this.state.name}
									avatar={this.state.avatar}
									id={this.state.id}
								/>
							</Panel>

							<Panel id="User">
								<PanelHeader separator={false} left={<PanelHeaderBack style={{ cursor: "pointer" }} onClick={() => this.goBack()} />}>
									Пользователь
			  </PanelHeader>

								<User
									theme={this.state.theme}
									userId={this.state.userId}
									userName={this.state.userName}
									userPicture={this.state.userPicture}
									userSex={this.state.userSex}
									changeQuestion={(isNew, name, answer, creator, questionId) => {
										this.handleConnectionChange()
										window.history.pushState({ panel: "question" }, "question");
										this.setState({
											activePanel: "question", isNewNow: isNew, questionTitle: name, hrefInsert: 'insertanswerusers',
											answerTitle: answer, history: [...this.state.history, "question"], loadingAnswer: true,
											creator: creator, idQuestion: questionId
										})
									}}
								/>
							</Panel>

							<Panel id="question">
								<PanelHeader separator={false} left={<PanelHeaderBack style={{ cursor: "pointer" }} onClick={() => this.goBack()} />}>
									Вопрос
			  </PanelHeader>

								<Question
									id={this.state.id}
									theme={this.state.theme}
									isNew={this.state.isNewNow}
									title={this.state.questionTitle}
									answer={this.state.answerTitle}
									hrefInsert={this.state.hrefInsert}
									loadDataAgain={this.state.loadDataAgain}
									loadingAnswer={this.state.loadingAnswer}
									creator={this.state.creator}
									loadedCreator={this.state.loadedCreator}
									questionId={this.state.idQuestion}
									myQuestion={this.state.myQuestion}
									updateAnswer={(answerID, answer) => {
										this.openQuestion(answerID, answer)
										this.setState({
											newAnswer: answer
										})
									}}
									changeProps={() => this.setState({
										loadingAnswer: false
									})}
									questionModal={(question) => {
										this.setActiveModal(MODAL_QUESTION);
										this.setState({
											allowToGoBack: false,
											question: question,
											history: [...this.state.history, "modal_question"]
										})
									}}
									reportQuestion={() => {
										this.setActiveModal(MODAL_REPORT);
										this.setState({
											allowToGoBack: false,
											history: [...this.state.history, "modal_question"]
										})
									}}
									changeToMain={() => {
										this.handleConnectionChange();
										this.setState({ activePanel: "panel1" }); this.getAllAnswers(); window.location.reload()
									}} />
							</Panel>

						</View>


						<View id="CreateQuestion" activePanel="CreateQuestion"
							history={this.state.history}
							modal={modal}
							popout={this.state.popout}
							onSwipeBack={this.goBack}>
							<Panel id="CreateQuestion">
								<PanelHeader>Редактирование</PanelHeader>
								<CreateQuestion
									addQuestionSpinner={() => this.addQuestionSpinner()}
									removeSpinner={() => this.removeSpinner()}
									dublicate={(errorText) => this.openDefault("Ошибка", errorText)}
									id={this.state.id}
									errorModal={(error) => {
										this.setActiveModal(MODAL_ERROR);
										this.setState({
											errorMessage: error,
											allowToGoBack: false,
											history: [...this.state.history, "modal"]
										})
									}}
									goQuestion={() => {
										this.setState({ activePanel: "QuesUsers", activeStory: "QuesUsers", history: ["QuesUsers"] });
									}}
								/>
							</Panel>
						</View>

					</Epic >
				) : (
						<div style={{
							display: "flex", justifyContent: "center",
							flexDirection: "column", alignItems: "center", height: "100vh", alignTtems: "center"
						}}>
							<img src={error} alt='Image' style={{ width: 200, height: 200, marginTop: "-30px" }} />

							<Text style={{ fontSize: 20, textAlign: "center", width: "calc(100% / 1.2)", paddingTop: 15, fontFamily: "'Fira Sans', sans-serif" }}>Проверьте ваше интернет соединение!</Text>
							<Button size="xl" style={{
								backgroundColor: this.state.theme == "space_gray" ? "#2b7ede" : "rgb(70 145 230)",
								color: "white", marginTop: 30, marginBottom: 20,
								width: "80%", cursor: "pointer", fontFamily: "'Fira Sans', sans-serif"
							}} onClick={() => this.handleConnectionChange()}>Повторить попытку</Button>
						</div>
					)}
			</div>
		)
	}
}
export default App;