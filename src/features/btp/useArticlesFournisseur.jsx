/**
 * useArticlesFournisseur.jsx
 *
 * Custom hook — gère l'état et les effets du catalogue d'articles.
 * Les composants consommateurs sont purement déclaratifs.
 */

import { useState, useEffect, useCallback } from 'react'
import {
  fetchArticlesFournisseur,
  createArticleComplet,
  mapArticleToRow,
} from './articleFournisseurService'

function getConnectedUserUUID() {
  try {
    const user = JSON.parse(sessionStorage.getItem('fournisseur_user') || '{}')
    return user.keycloakId || null
  } catch {
    return null
  }
}

export function useArticlesFournisseur() {
  const [rows, setRows]         = useState([])
  const [isLoading, setLoading] = useState(true)
  const [error, setError]       = useState(null)

  const loadArticles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchArticlesFournisseur()
      setRows(data.map(mapArticleToRow))
    } catch (err) {
      setError(err.message || 'Impossible de charger les articles.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadArticles() }, [loadArticles])

  const addArticle = useCallback(async (form, documentFile) => {
    const uuid = getConnectedUserUUID()
    const { article, prix, fichier } = await createArticleComplet(form, documentFile, uuid)
    const newRow = mapArticleToRow({
      ...article,
      prix: prix ? [prix] : [],
      fichiers: fichier ? [fichier] : [],
    })
    setRows(prev => [newRow, ...prev])
    return newRow
  }, [])

  const removeArticle = useCallback((id) => {
    setRows(prev => prev.filter(r => r.id !== id))
  }, [])

  return { rows, isLoading, error, addArticle, removeArticle, reload: loadArticles }
}
