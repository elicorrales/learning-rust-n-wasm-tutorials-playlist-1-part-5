# This project is part of a series and includes a video.

See [Here](https://github.com/elicorrales/learning-rust-n-wasm-tutorials/blob/main/README.md) for the overall document that refers to all the series.  
  

```
;; <---single line comments
;; comments alone in a file caused error: unexpected token "EOF", expected a module field or a module.

(;
 these are block comments
 that can take up multiple lines
 ;)

;;(module) ;; <-- this is the absolute simplest wat (or wasm) file

;;(module) (module) ;; <-- you can NOT have more than 1 top-level module: ERROR

;;(module (module) )  ;; <-- you can NOT have a module within a module: ERROR

;;(module () ) ;; <-- ERROR: expected a module field within the ()

;;(module (me) ) ;; <-- ERROR: 'me' isnt a valid module field

;;(module (func) ) ;; <-- this compiled, but cant run it, not exported

;;(module (func $add) ) ;; <-- named func, this compiled, but cant run it, not exported


(;BEGIN BLOCK COMMENTS -----------------------------------------------
;; you can format the module code, it doesnt have to be on a single line
(
 module (
         func $add
         ) 
 ) 
---------------------------------------------------END BLOCK COMMENTS;)


(;BEGIN BLOCK COMMENTS -----------------------------------------------
;; this version exports the 'myfunc' function and it can be executed.
;; of course it does nothing.
( module 
  (func $myfunc)
  (export "myfunc" (func $myfunc))
 ) 
---------------------------------------------------END BLOCK COMMENTS;)


(;BEGIN BLOCK COMMENTS -----------------------------------------------
;; interestingly, this converted to wasm although the 'result' didnt 
;; have a type
(module 
  (func $myfunc (result) )
  (export "myfunc" (func $myfunc))
) 
---------------------------------------------------END BLOCK COMMENTS;)




(;BEGIN BLOCK COMMENTS -----------------------------------------------
;;my.wat:55:4: error: type mismatch in implicit return, expected [i32] but got []
;;  (func $myfunc (result i32) )
;;   ^^^^
;; so this error is because our function body doesnt do what the signature
;; says it does - it's supposed to return an i32
(module 
  (func $myfunc (result i32) )
  (export "myfunc" (func $myfunc))
) 
---------------------------------------------------END BLOCK COMMENTS;)




(;BEGIN BLOCK COMMENTS -----------------------------------------------
;;my.wat:73:31: error: unexpected token ")", expected an instr.
;;  (func $myfunc (result i32) () )
;;                              ^
(module 
  (func $myfunc (result i32) ()
    ;;body of code will go here
  )
  (export "myfunc" (func $myfunc))
) 
---------------------------------------------------END BLOCK COMMENTS;)





(;BEGIN BLOCK COMMENTS -----------------------------------------------
;;my.wat:90:31: error: unexpected token "0", expected an instr.
;;  (func $myfunc (result i32) (0) )
;;                              ^
(module 
  (func $myfunc (result i32) (0)
    ;;body of code will go here
  )
  (export "myfunc" (func $myfunc))
) 
---------------------------------------------------END BLOCK COMMENTS;)





(;BEGIN BLOCK COMMENTS -----------------------------------------------
;;my.wat:87:40: error: unexpected token ")", expected a numeric literal (e.g. 123, -45, 6.7e8).
;;  (func $myfunc (result i32) (i32.const) )
;;                                       ^
(module 
  (func $myfunc (result i32) (i32.const) 
    ;;body of code will go here
  )
  (export "myfunc" (func $myfunc))
) 
---------------------------------------------------END BLOCK COMMENTS;)





(;BEGIN BLOCK COMMENTS -----------------------------------------------
;; this works
(module 
  (func $myfunc (result i32) 

    i32.const 0 ;; pushs a 0 onto stack

    ;; implicit returns top of stack (or 0 in this case)

  )
  (export "myfunc" (func $myfunc))
) 
---------------------------------------------------END BLOCK COMMENTS;)






(;BEGIN BLOCK COMMENTS -----------------------------------------------
;; this works
(module 
  (func $myfunc (param $0 i32) (result i32) 

    local.get $0 ;; get value from param $0 , push onto stack

    ;; implicit return of top of stack (in this case value of $0)

  )
  (export "myfunc" (func $myfunc))
) 
---------------------------------------------------END BLOCK COMMENTS;)






(;BEGIN BLOCK COMMENTS -----------------------------------------------
;; this works
(module 
  (func $myfunc (param $0 i32) (param $1 i32) (result i32) 
    (local.get $0) ;; get value from param $0 , push onto stack
    (local.get $1) ;; get value from param $1 , push onto stack

    ;; implicit return HERE will NOT work 

    return
  )
  (export "myfunc" (func $myfunc))
) 
---------------------------------------------------END BLOCK COMMENTS;)

```
