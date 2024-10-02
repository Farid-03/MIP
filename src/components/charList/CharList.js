import React, { Component } from 'react'
import './charList.scss'
import MarvelService from '../../services/MarvelService'
import Spinner from '../spinner/Spinner'

class CharList extends Component {
	state = {
		characters: [],
		loading: true,
	}

	marvelService = new MarvelService()

	componentDidMount() {
		this.fetchCharacters()
	}

	fetchCharacters = async () => {
		try {
			const charactersData = await this.marvelService.getAllCharacters()
			if (Array.isArray(charactersData)) {
				this.setState({ characters: charactersData })
			} else {
				console.error('Expected an array but received:', charactersData)
			}
		} catch (error) {
			console.error('Error fetching characters:', error)
		} finally {
			this.setState({ loading: false })
		}
	}

	render() {
		const { characters, loading } = this.state

		if (loading) {
			return <Spinner />
		}

		return (
			<div className='char__list'>
				<ul className='char__grid'>
					{characters.map(char => {
						const isImageAvailable =
							char.thumbnail !==
							'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
						const imgStyle = isImageAvailable ? {} : { objectFit: 'unset' }

						return (
							<li key={char.id} className='char__item'>
								<img src={char.thumbnail} alt={char.name} style={imgStyle} />
								<div className='char__name'>{char.name}</div>
							</li>
						)
					})}
				</ul>
				<button className='button button__main button__long'>
					<div className='inner'>load more</div>
				</button>
			</div>
		)
	}
}

export default CharList
