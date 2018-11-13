import * as React from 'react';
import './App.css';

import logo from './logo.svg';

const initialState = { counter: 0 }
type State = Readonly<typeof initialState>

class App extends React.Component<{}, State> {
    readonly state: State = initialState
    componentDidMount() {
        this.testFetch()
    }
    render() {
        const { counter } = this.state;
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <h1>{counter}</h1>
                <p className="App-intro">
                    To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
            </div>
        );
    }
    private updateCounter = (prevState: State) => ({ counter: prevState.counter })
    private testFetch() {
        fetch("/api").then(resp => resp.body).then(body => {
            this.setState(this.updateCounter)
        })
    }
}

export default App;
