import * as React from 'react';


class Home extends React.Component<any, any> {
    public render() {
        console.log('props',this.props);
        return(
            <div>
                Heyo, home screen ;P
            </div>
        )
    }
}

export default Home;