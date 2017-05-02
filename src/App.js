import React, {Component} from 'react';
import logo from './logo.png';
import gift from './gift.png';
import announcement from './announcement-icon.png';
import './App.css';

import frozen from './stayFrozen.JPG';
import survived from './iphoneSurvived.JPG';

const PW = window.Pushwoosh;

class App extends Component {
	state = {
		ready: '---',
		subscribe: '---',
		register: '---',
		permission: '---',
		params: {},
		showMenu: false
	};

	componentWillMount() {
		window.Pushwoosh.push(['onSubscribe', api => this.setState({subscribe: 'true'})]);
		window.Pushwoosh.push(['onUnsubscribe', api => this.setState({subscribe: 'false'})]);
		window.Pushwoosh.push(['onPermissionPrompt', api => this.setState({permission: 'prompt'})]);
		window.Pushwoosh.push(['onPermissionDenied', api => this.setState({permission: 'denied'})]);
		window.Pushwoosh.push(['onPermissionGranted', api => this.setState({permission: 'granted'})]);
		window.Pushwoosh.push(['onReady', ({params}) => this.setState({ready: 'true', params})]);
	}

	send() {
		const {applicationCode} = this.state.params;
		return fetch('https://cp.pushwoosh.com/json/1.3/createMessage', {
			method: 'post',
			body: JSON.stringify({
				request: {
					application: applicationCode,
					auth: 'TOI09wF1QoglCSqSNeoY1mNQX3I7Y3YZ1VZaLgzpMQ7Wscd6pBIQcGqOH65XqMcaEMgSdpsz9vYbS7iwIhGw',
					notifications: [{
						send_date: 'now',
						ignore_user_timezone: true,
						content: this.state.message
					}]
				}
			}),
		});
	}

	addToWishlist() {
		window.Pushwoosh.push(function(api) {
			var myCustomTags = {
				'Wishlist': 'case'
			};
			api.setTags(myCustomTags)
				.then(function(res) {
					var skipped = res && res.skipped || [];
					if (!skipped.length) {
						console.log('success');
					}
					else {
						console.warn('skipped tags:', skipped);
					}
				})
				.catch(function(err) {
					console.error('setTags error:', err);
				});
		});
	}

	render() {

		return (
			<div className="App">
				{this.renderContent()}
				<div className="send-push">
					<div className="send-push-content">
						<h3>Type a message here:</h3>
					<textarea className="push-text" onChange={e => this.setState({message: e.target.value})} cols="30" rows="10"/>
					<div>
						<button className="yellow-button button" onClick={this.send.bind(this)}>Send!</button>
					</div>
					</div>
				</div>
				{this.state.showMenu ? this.renderMenu() : this.renderBurger()}
				<div key="shop" className="shop">
					<div className="shop-content">
						<span className="badge">New!</span>
						<img src={frozen} alt="Stay Frozen" className="preview"/>
						<p>Laika - frosted case for iphone</p>
						<div className="button-block">
							<button onClick={() => this.send.bind(this)} className="buy-button button">BUY</button>
							<p className="or">or</p>
							<button onClick={() => this.addToWishlist()} className="wishlist-button button">Add to Wishlist</button>
						</div>
					</div>
					<div className="shop-content">
						<span className="badge">Hot!</span>
						<img src={survived} alt="Stay Frozen" className="preview"/>
						<p>I was in Siberia - frosted case for iphone</p>
						<div className="button-block">
							<button onClick={() => this.send.bind(this)} className="buy-button button">BUY</button>
							<p className="or">or</p>
							<button onClick={() => this.addToWishlist()} className="wishlist-button button">Add to Wishlist</button>
						</div>
					</div>
				</div>
				{/*<div className="layout">
					<div className="first-page">
						<img src={logo} alt="Pushwoosh Logo" className="App-logo"/>
						<h1>Your websites can talk</h1>
						<h3>Start something</h3>
						<button className="blue-button" onClick={this.handleClick.bind(this)}>START</button>
					</div>
				</div>*/}
			</div>
		);
	}

	handleClick() {
		this.setState({showMenu: true})
	}

	renderContent() {
		return (
			<div key="subscription" className="subscription">
				<div className="subscription-content">
					<img src={gift} alt="Nice Choice!" className="gift-image"/>
					<h2>Thanks for shopping.</h2>
					<p>Would you like to receive discount update from us?</p>
					<button onClick={() => window.Pushwoosh.subscribe()} className="green-button">YES, I WANT</button>
				</div>
				<div className="subscription-content-2">
					<img src={announcement} alt="Nice Choice!" className="gift-image"/>
					<h2>Subscribe to be the first!</h2>
					<p>Who know about new features we release and discounts we offer</p>
					<button onClick={() => window.Pushwoosh.subscribe()} className="white-button">GET IT!</button>
				</div>
			</div>
		);
	}

	renderBurger() {
		return (
			<span className="menu-burger" onClick={() => this.setState({showMenu: true})}><div className="burger"></div>
					<div className="burger"></div>
					<div className="burger"></div></span>
		)
	}

	renderMenu() {
		return (
			<div className="menu">
				<span className="info menu-burger" onClick={() => this.setState({showMenu: false})}>Close</span>
				<div className="info">Ready: {this.state.ready}</div>
				<div className="info">Subscribe: {this.state.subscribe}</div>
				<div className="info">Permission: {this.state.permission}</div>

				<button className="info white button" onClick={() => window.Pushwoosh.subscribe()}>Subscribe?</button>
				<button className="info white button" onClick={() => window.Pushwoosh.unsubscribe()}>Unsubscribe!</button>
			</div>
		)
	}

	/*renderFooter() {
		return (
			<ul className="footer">
			</ul>
		)
	}

	renderSubscribePage() {
		return (
		<div className="subscribe">
			<div className="subscribe-content">
				<img src={logo} alt="Pushwoosh Logo" className="App-logo"/>
				<h1>Your websites can talk</h1>
				<h3>Start something</h3>
				<button className="blue-button">Start</button>
			</div>
			{this.state.active === 'subscribe' && <div className="subscribe-diagonal"/>}
		</div>
		)
	}

	renderLoginPage() {
		return (
			<div className="login">
				<div className="login-content">

				</div>
				{this.state.active === 'login' && <div className="login-diagonal"/>}
				{/*<div className="subscribe-heading">
					<img src={logo} alt="Pushwoosh Logo" className="App-logo"/>
					<h1>Your mobile app & <br/>
						website can talk</h1>
					<h2>Push & In-App Messaging boost conversion rate and increase ROI by 100%
					</h2>
				</div>
				<div className="subscribe-diagonal">
				</div>*/
				/*this.renderFooter()*/
				/*<div className="login">
				 <div className="heading">
				 <img src={logo} alt="Pushwoosh Logo" className="App-logo"/>
				 <h1>Your mobile app & <br/>
				 website can talk</h1>
				 <h2>Push & In-App Messaging boost conversion rate and increase ROI by 100%
				 </h2>
				 </div>
				 </div>
				 */
				/*this.renderMenu()
				 {this.renderSubscribePage()}
				 {this.renderLoginPage()*/
			/*</div>
		)
	}*/
}

export default App;
/* sender id //"732110682735",
* appcode '2F881-E1862',
* */