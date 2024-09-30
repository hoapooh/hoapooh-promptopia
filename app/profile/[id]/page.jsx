'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import Profile from '@components/Profile'

const ProfileUserPage = ({ params }) => {
  console.log(params);

  const router = useRouter()
  const searchParams = useSearchParams()

  const username = searchParams.get('name')

  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`/api/users/${params?.id}/posts`)
      const data = await res.json()

      setPosts(data)
    }

    if (params?.id) fetchPosts()
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
      name={username}
      desc={`Welcome to ${username}'s personalized profile page`}
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  )
}

export default ProfileUserPage
