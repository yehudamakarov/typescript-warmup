import * as React from 'react';


const initialState = { counter: 0 }
type State = Readonly<typeof initialState>

class App extends React.Component<{}, State> {
    readonly state: State = initialState

    incrementCounter = () => {
        this.setState(prevState => ({
            counter: prevState.counter + 1,
        }))
    }

    render() {
        const { counter } = this.state;
        return (
            <div>
                <h1>Counter: {counter}</h1>
                <button onClick={this.incrementCounter}>Incrememnt</button>
            </div>
        );
    }
}

export default App;
