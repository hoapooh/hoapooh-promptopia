'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import Profile from '@components/Profile'

const ProfilePage = () => {
	const { data: session } = useSession()
	const router = useRouter()

	const [posts, setPosts] = useState([])

	useEffect(() => {
		const fetchPosts = async () => {
			const res = await fetch(`/api/users/${session?.user.id}/posts`)
			const data = await res.json()

			setPosts(data)
		}

		if (session?.user.id) fetchPosts()
	}, [])

	const handleEdit = (post) => {
		router.push(`/update-prompt?id=${post._id}`)
	}

	const handleDelete = async (post) => {
		const hasConfirmed = confirm('Are you sure you want to delete this prompt?')

		if (hasConfirmed) {
			try {
				await fetch(`api/prompt/${post._id}`, {
					method: 'DELETE',
				})

				const filteredPost = posts.filter((po) => po._id !== post._id)

				setPosts(filteredPost)
			} catch (error) {
				console.error('DELETE ERROR', error)
			}
		}
	}

	return (
		<Profile
			name="My"
			desc="Welcome to your personalized profile page"
			data={posts}
			handleEdit={handleEdit}
			handleDelete={handleDelete}
		/>
	)
}

export default ProfilePage
