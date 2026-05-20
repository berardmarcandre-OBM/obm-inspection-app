import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import { db } from '../config/firebase'

export const createInspection = async (inspectorId, inspectionData) => {
  try {
    const docRef = await addDoc(collection(db, 'inspections'), {
      ...inspectionData,
      inspectorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const getInspectorInspections = async (inspectorId) => {
  try {
    const q = query(
      collection(db, 'inspections'),
      where('inspectorId', '==', inspectorId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return {
      success: true,
      data: querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const getClientInspections = async (clientId) => {
  try {
    const q = query(
      collection(db, 'inspections'),
      where('clientId', '==', clientId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return {
      success: true,
      data: querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const getInspection = async (inspectionId) => {
  try {
    const docRef = doc(db, 'inspections', inspectionId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } }
    } else {
      return { success: false, error: 'Inspection non trouvée' }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const updateInspection = async (inspectionId, updatedData) => {
  try {
    const docRef = doc(db, 'inspections', inspectionId)
    await updateDoc(docRef, {
      ...updatedData,
      updatedAt: new Date(),
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const deleteInspection = async (inspectionId) => {
  try {
    await deleteDoc(doc(db, 'inspections', inspectionId))
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
