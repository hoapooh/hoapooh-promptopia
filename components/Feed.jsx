'use client'

import { useState, useEffect } from 'react'

import PromptCard from './PromptCard'

const PromptCardList = ({ data, handleTagClick, test }) => {
	return (
		<div className="mt-16 prompt_layout">
			{data.map((post) => (
				<PromptCard
					key={post._id}
					post={post}
					handleTagClick={handleTagClick}
				/>
			))}
		</div>
	)
}

const Feed = () => {
	const [searchText, setSearchText] = useState('')
	const [searchTimeout, setSearchTimeout] = useState(null)
	const [searchResults, setSearchResults] = useState([])

	const [posts, setPosts] = useState([])

	const fetchPosts = async () => {
		const res = await fetch('/api/prompt')
		const data = await res.json()

		setPosts(data)
	}

	useEffect(() => {
		fetchPosts()
	}, [])

	const filterPrompts = (searchText) => {
		const regex = new RegExp(searchText, 'i') // 'i' flag for case-insensitive search
		return posts.filter(
			(post) =>
				regex.test(post.creator.username) ||
				regex.test(post.tag) ||
				regex.test(post.prompt)
		)
	}

	const handleSearchChange = (e) => {
		clearTimeout(searchTimeout) // Clear any existing timeout

		setSearchText(e.target.value) // Update the search text state

		// Set a new timeout to debounce the search operation
		setSearchTimeout(
			setTimeout(() => {
				const searchResult = filterPrompts(e.target.value) // Filter posts based on search text
				setSearchResults(searchResult) // Update the search results state
			}, 500) // Wait for 500ms before executing the search
		)
	}

	const handleTagClick = (tagName) => {
		setSearchText(tagName)

		const searchResult = filterPrompts(tagName)
		setSearchResults(searchResult)
	}

	return (
		<section className="feed">
			<form className="relative w-full flex-center">
				<input
					type="text"
					placeholder="Search for a tag or a username"
					value={searchText}
					onChange={handleSearchChange}
					required
					className="search_input peer"
				/>
			</form>
			{searchText ? (
				<PromptCardList data={searchResults} handleTagClick={handleTagClick} />
			) : (
				<PromptCardList data={posts} handleTagClick={handleTagClick} />
			)}
		</section>
	)
}

export default Feed
