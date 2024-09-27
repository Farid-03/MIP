import { Component } from 'react'
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'
import MarvelService from '../../services/MarvelService'
import './randomChar.scss'
import mjolnir from '../../resources/img/mjolnir.png'

class RandomChar extends Component {
	constructor(props) {
		super(props)
		this.updateChar()
	}

	state = {
		char: {},
		isDescriptionExpanded: false,
		loading: true,
		error: false,
	}

	marvelService = new MarvelService()

	onChatLoaded = char => {
		this.setState({ char, loading: false })
	}

	onError = () => {
		this.setState({
			loading: false,
			error: true,
		})
	}

	updateChar = () => {
		const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000)
		this.marvelService
			.getCharacter(id)
			.then(this.onChatLoaded)
			.catch(this.onError)
	}

	toggleDescription = () => {
		this.setState(prevState => ({
			isDescriptionExpanded: !prevState.isDescriptionExpanded,
		}))
	}

	render() {
		const { char, loading, error } = this.state
		const errorMessage = error ? <ErrorMessage /> : null
		const spinner = loading ? <Spinner /> : null
		const content = !(loading || error) ? (
			<View
				char={char}
				isDescriptionExpanded={this.state.isDescriptionExpanded}
				toggleDescription={this.toggleDescription}
			/>
		) : null

		return (
			<div className='randomchar'>
				{errorMessage}
				{spinner}
				{content}
				{/* {loading ? <Spinner /> : <View char={char} />} */}
				<div className='randomchar__static'>
					<p className='randomchar__title'>
						Random character for today!
						<br />
						Do you want to get to know him better?
					</p>
					<p className='randomchar__title'>Or choose another one</p>
					<button className='button button__main'>
						<div className='inner'>try it</div>
					</button>
					<img src={mjolnir} alt='mjolnir' className='randomchar__decoration' />
				</div>
			</div>
		)
	}
}

const View = ({ char, toggleDescription, isDescriptionExpanded }) => {
	const { name, description, thumbnail, homepage, wiki } = char

	let displayDescription

	if (!description) {
		displayDescription = 'NOT FOUND'
	} else if (isDescriptionExpanded || description.length <= 100) {
		displayDescription = description
	} else {
		displayDescription = description.slice(0, 97)
	}

	return (
		<div className='randomchar__block'>
			<img src={thumbnail} alt='Random character' className='randomchar__img' />
			<div className='randomchar__info'>
				<p className='randomchar__name'>{name}</p>
				<p className='randomchar__descr'>
					{displayDescription}
					{description &&
						description.length > 100 &&
						!isDescriptionExpanded && (
							<span onClick={toggleDescription} className='toggle-text'>
								{'...'}
							</span>
						)}
				</p>
				<div className='randomchar__btns'>
					<a href={homepage} className='button button__main'>
						<div className='inner'>homepage</div>
					</a>
					<a href={wiki} className='button button__secondary'>
						<div className='inner'>Wiki</div>
					</a>
				</div>
			</div>
		</div>
	)
}

export default RandomChar
