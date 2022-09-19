;; is this a single line comment
(;
 (func $name  ()  () () )
 ;)
(module
  (func $myfunc (param i32) (param i32)  (result i32)
        local.get 0
        local.get 1
        return
  )
  
  (func $add (param $a i32) (param $b i32)  (result i32)
        local.get $a
        local.get $b
        i32.add
  )
  
  (func $mul (param $a i32) (param $b i32)  (result i32)
        local.get $a
        local.get $b
        i32.mul
  )
  
  (func $square (param $a i32) (result i32)
        local.get $a
        local.get $a
        i32.mul
  )
  
  (export "myfunc" (func $myfunc))
  (export "add" (func $add))
  (export "mul" (func $mul))
  (export "square" (func $square))
)
