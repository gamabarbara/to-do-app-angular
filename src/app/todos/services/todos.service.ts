import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, map, merge, mergeMap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Todo } from 'src/app/models/Todo';
import { User } from '../../models/User'
@Injectable({
  providedIn: 'root'
})
export class TodosService {
  private usersCollection = this.store.collection<User>('users')
  private currentUser = this.authService.currentUser

  constructor(
    private store: AngularFirestore,
    private authService: AuthService
  ) { }

 getTodos() {
  return this.currentUser
  .pipe(
    mergeMap(user => {
      // A função get serve para recuperar os dados de um documento no firebase
      return this.usersCollection.doc(user?.uid).get() 
    }),
    map(userDoc => {
      // A função data retorna um objeto com os dados do documento do firebase
      return userDoc.data()?.todos || []
    })
  )
 }
 createTodo(todo: Todo) {
  return this.currentUser
  .pipe(
    mergeMap(user => {
      return this.usersCollection.doc(user?.uid).get()
    }),
    mergeMap(userDoc => {
      const user = userDoc.data() as User
      todo.id = this.store.createId()

      user.todos.push(todo)
      return userDoc.ref.update(user)
    })
  )
 }

 deleteTodo(todo: Todo) {
  return this.currentUser
  .pipe(
    mergeMap(user => {
      return this.usersCollection.doc(user?.uid).get()
    }),
    mergeMap(userDoc => {
      const user = userDoc.data() as User
      user.todos = user.todos.filter(t => {
        return t.id != todo.id
      })
      return userDoc.ref.update(user)
    })
  )
 }

 updateTodo(todo: Todo) {
  return this.currentUser
  .pipe(
    mergeMap(user => {
      return this.usersCollection.doc(user?.uid).get()
    }),
    mergeMap(userDoc => {
      const user = userDoc.data() as User
      user.todos = user.todos.map(t => {
        if(t.id == todo.id) {
          return todo
        } else {
          return t
        }
      })
      return userDoc.ref.update(user)
    })
  )
 }
 }
 
