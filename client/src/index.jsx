import React from 'react';
import ReactDOM from 'react-dom';
import controllers from '../../server/controllers';
import styled from 'styled-components';
import Carousel from 'react-elastic-carousel';

//Import Sub-Component;
import CarouselItem from './components/CarouselItem';

//Styled Components;
const Container = styled.div`
    display: flex;
    justify-content: center;
    padding: 0px;
`;

const Title = styled.h3`
    display: inline-block;
    font-family: sans-serif;
    padding-left: 40px;
    margin: 8px;
`;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: []
        };
        this.breakPoints = [
            { width: 1, itemsToShow: 1 },
            { width: 300, itemsToShow: 2 },
            { width: 600, itemsToShow: 3 },
            { width: 900, itemsToShow: 4 }
        ];
    }

    componentDidMount() {
        controllers.getFurnitures(Number(window.location.pathname.split('/').slice(-1)))
          .then(({data}) => {
              this.setState({
                  items: data
              });
          })
    }

    render() {
        console.log(this.state.items)
        return (
            <div id="BottomCarousel">
                <Title>Similar Products</Title>
                <Container>
                    <Carousel
                    itemPadding={[10, 19]}
                    breakPoints={this.breakPoints}
                    itemsToShow={4}
                    >
                    {this.state.items.map((item) => {
                        return (<CarouselItem key={item['_id']} item={item}/>);
                    })}
                    </Carousel>
                </Container>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('BottomCarousel'));