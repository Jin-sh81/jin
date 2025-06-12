import { db, storage } from '@/infrastructure/firebase/firebaseConfig'
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import type { Project, ProjectTask, ProjectStats } from '@/types/project'

// 프로젝트 컬렉션 참조 가져오기
const getProjectsRef = (uid: string) => collection(db, 'users', uid, 'projects')

// 프로젝트 목록 조회
export const getProjects = async (uid: string): Promise<Project[]> => {
  try {
    const projectsRef = getProjectsRef(uid)
    const q = query(projectsRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project))
  } catch (error) {
    console.error('프로젝트 목록 조회 실패:', error)
    throw new Error('프로젝트 목록을 불러오는데 실패했습니다.')
  }
}

// 프로젝트 상세 조회
export const getProject = async (uid: string, projectId: string): Promise<Project> => {
  try {
    const projectRef = doc(db, 'users', uid, 'projects', projectId)
    const docSnap = await getDoc(projectRef)
    if (!docSnap.exists()) {
      throw new Error('프로젝트를 찾을 수 없습니다.')
    }
    return { id: docSnap.id, ...docSnap.data() } as Project
  } catch (error) {
    console.error('프로젝트 상세 조회 실패:', error)
    throw new Error('프로젝트 정보를 불러오는데 실패했습니다.')
  }
}

// 프로젝트 생성
export const createProject = async (uid: string, project: Omit<Project, 'id'>): Promise<Project> => {
  try {
    const projectsRef = getProjectsRef(uid)
    const docRef = await addDoc(projectsRef, {
      ...project,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    return { id: docRef.id, ...project } as Project
  } catch (error) {
    console.error('프로젝트 생성 실패:', error)
    throw new Error('프로젝트 생성에 실패했습니다.')
  }
}

// 프로젝트 수정
export const updateProject = async (uid: string, projectId: string, data: Partial<Project>): Promise<Project> => {
  try {
    const projectRef = doc(db, 'users', uid, 'projects', projectId)
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    }
    await updateDoc(projectRef, updateData)
    const updatedDoc = await getDoc(projectRef)
    return { id: updatedDoc.id, ...updatedDoc.data() } as Project
  } catch (error) {
    console.error('프로젝트 수정 실패:', error)
    throw new Error('프로젝트 수정에 실패했습니다.')
  }
}

// 프로젝트 삭제 (소프트 삭제)
export const deleteProject = async (uid: string, projectId: string): Promise<void> => {
  try {
    const projectRef = doc(db, 'users', uid, 'projects', projectId)
    await updateDoc(projectRef, {
      deleted: true,
      deletedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('프로젝트 삭제 실패:', error)
    throw new Error('프로젝트 삭제에 실패했습니다.')
  }
}

// 프로젝트 태스크 조회
export const getProjectTasks = async (uid: string, projectId: string): Promise<ProjectTask[]> => {
  try {
    const tasksRef = collection(db, 'users', uid, 'projects', projectId, 'tasks')
    const q = query(tasksRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ProjectTask[]
  } catch (error) {
    console.error('프로젝트 태스크 조회 실패:', error)
    throw new Error('작업 목록을 불러오는데 실패했습니다.')
  }
}

// 프로젝트 태스크 생성
export const createProjectTask = async (uid: string, projectId: string, task: Omit<ProjectTask, 'id'>): Promise<ProjectTask> => {
  try {
    const tasksRef = collection(db, 'users', uid, 'projects', projectId, 'tasks')
    const docRef = await addDoc(tasksRef, {
      ...task,
      createdAt: Timestamp.now().toDate().toISOString(),
      updatedAt: Timestamp.now().toDate().toISOString()
    })
    
    return {
      id: docRef.id,
      ...task,
      createdAt: Timestamp.now().toDate().toISOString(),
      updatedAt: Timestamp.now().toDate().toISOString()
    } as ProjectTask
  } catch (error) {
    console.error('프로젝트 태스크 생성 실패:', error)
    throw new Error('작업 생성에 실패했습니다.')
  }
}

// 프로젝트 태스크 수정
export const updateProjectTask = async (uid: string, projectId: string, taskId: string, task: Partial<ProjectTask>): Promise<ProjectTask> => {
  try {
    const taskRef = doc(db, 'users', uid, 'projects', projectId, 'tasks', taskId)
    const updatedTask = {
      ...task,
      updatedAt: Timestamp.now().toDate().toISOString()
    }
    await updateDoc(taskRef, updatedTask)
    
    const taskDoc = await getDoc(taskRef)
    return {
      id: taskId,
      ...taskDoc.data()
    } as ProjectTask
  } catch (error) {
    console.error('프로젝트 태스크 수정 실패:', error)
    throw new Error('작업 수정에 실패했습니다.')
  }
}

// 프로젝트 태스크 삭제 (소프트 삭제)
export const deleteProjectTask = async (uid: string, projectId: string, taskId: string): Promise<void> => {
  try {
    const taskRef = doc(db, 'users', uid, 'projects', projectId, 'tasks', taskId)
    await updateDoc(taskRef, {
      deleted: true,
      deletedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('프로젝트 태스크 삭제 실패:', error)
    throw new Error('작업 삭제에 실패했습니다.')
  }
}

// 프로젝트 통계 조회
export const getProjectStats = async (uid: string, projectId: string): Promise<ProjectStats> => {
  try {
    const project = await getProject(uid, projectId)
    const totalTasks = project.tasks.length
    const completedTasks = project.tasks.filter(task => task.status === 'completed').length
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    return {
      totalTasks,
      completedTasks,
      completionRate
    }
  } catch (error) {
    console.error('프로젝트 통계 조회 실패:', error)
    throw new Error('프로젝트 통계를 불러오는데 실패했습니다.')
  }
}

// 이미지 업로드
export const uploadImage = async (uid: string, file: File): Promise<string> => {
  try {
    const storageRef = ref(storage, `users/${uid}/images/${Date.now()}_${file.name}`)
    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)
    return downloadURL
  } catch (error) {
    console.error('이미지 업로드 실패:', error)
    throw new Error('이미지 업로드에 실패했습니다.')
  }
}

// 이미지 삭제
export const deleteImage = async (url: string): Promise<void> => {
  try {
    const imageRef = ref(storage, url)
    await deleteObject(imageRef)
  } catch (error) {
    console.error('이미지 삭제 실패:', error)
    throw new Error('이미지 삭제에 실패했습니다.')
  }
} 