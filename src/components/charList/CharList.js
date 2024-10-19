import React, { Component } from 'react';
import './charList.scss';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';

class CharList extends Component {
    state = {
        characters: [],
        loading: true,
        offset: 0,
        newItemsLoading: false,
    };

    marvelService = new MarvelService();

    componentDidMount() {
        this.fetchCharacters();
    }

    fetchCharacters = async () => {
        this.setState({ newItemsLoading: true }); 

        try {
            const { offset, characters } = this.state;
            const charactersData = await this.marvelService.getAllCharacters(offset);
            if (Array.isArray(charactersData)) {
                this.setState({
                    characters: [...characters, ...charactersData],
                    offset: offset + 9,
                });
            } else {
                console.error('Expected an array but received:', charactersData);
            }
        } catch (error) {
            console.error('Error fetching characters:', error);
        } finally {
            this.setState({ loading: false, newItemsLoading: false });
        }
    };

    onCharSelected = (id) => {
        this.props.onCharSelected(id); 
        window.scrollTo({
            top: 0,
            behavior: 'smooth', 
        });
    };

    render() {
        const { characters, loading, newItemsLoading } = this.state;

        if (loading && characters.length === 0) {
            return <Spinner />;
        }

        return (
            <div className='char__list'>
                <ul className='char__grid'>
                    {characters.map((char) => {
                        const isImageAvailable =
                            char.thumbnail !==
                            'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
                        const imgStyle = isImageAvailable ? {} : { objectFit: 'unset' };

                        return (
                            <li
                                key={char.id}
                                className='char__item'
                                onClick={() => this.onCharSelected(char.id)} 
                            >
                                <img src={char.thumbnail} alt={char.name} style={imgStyle} />
                                <div className='char__name'>{char.name}</div>
                            </li>
                        );
                    })}
                </ul>
                <button
                    className='button button__main button__long'
                    onClick={this.fetchCharacters} 
                    disabled={newItemsLoading} 
                >
                    <div className='inner'>
                        {newItemsLoading ? 'loading...' : 'load more'}
                    </div>
                </button>
            </div>
        );
    }
}

export default CharList;
