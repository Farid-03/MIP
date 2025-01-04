import React, { useState, useEffect } from 'react'
import './charList.scss'
import MarvelService from '../../services/MarvelService'
import Spinner from '../spinner/Spinner'

const CharList = ({ onCharSelected }) => {
	const [characters, setCharacters] = useState([])
	const [loading, setLoading] = useState(true)
	const [offset, setOffset] = useState(0)
	const [newItemsLoading, setNewItemsLoading] = useState(false)

	const marvelService = new MarvelService()

	useEffect(() => {
		fetchCharacters()
	}, []) // Зависимости пустые, чтобы вызывать только при монтировании

	const fetchCharacters = async () => {
		setNewItemsLoading(true)
		try {
			const charactersData = await marvelService.getAllCharacters(offset)
			if (Array.isArray(charactersData)) {
				setCharacters(prevCharacters => [...prevCharacters, ...charactersData])
				setOffset(prevOffset => prevOffset + 9)
			} else {
				console.error('Expected an array but received:', charactersData)
			}
		} catch (error) {
			console.error('Error fetching characters:', error)
		} finally {
			setLoading(false)
			setNewItemsLoading(false)
		}
	}

	const handleCharSelected = id => {
		onCharSelected(id)
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		})
	}

	if (loading && characters.length === 0) {
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
						<li
							key={char.id}
							className='char__item'
							onClick={() => handleCharSelected(char.id)}
						>
							<img src={char.thumbnail} alt={char.name} style={imgStyle} />
							<div className='char__name'>{char.name}</div>
						</li>
					)
				})}
			</ul>
			<button
				className='button button__main button__long'
				onClick={fetchCharacters}
				disabled={newItemsLoading}
			>
				<div className='inner'>
					{newItemsLoading ? 'loading...' : 'load more'}
				</div>
			</button>
		</div>
	)
}

export default CharList
