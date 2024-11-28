// Exportamos una "key" para el inyector de dependencias usando un Symbol()
// de JS.
// Symbol es una clase invocable de JS. Esto es, que nos permite invorcarla 
// como función.
// Nos retorna un identificador único. Este identificador no tiene una
// representación como string o number o nada, sino que es un Symbol.
// Es *imposible* en JS crear dos Symbols iguales.
// Opcionalmente, a la función Symbol() le pueden pasar un parámetro que
// sea una descripción del símbolo. Es solo con fines de depuración.
// Los Symbols son una manera fenomenal de manejar las claves de elementos
// que necesitamos estén estandarizados en el sistema.
export const dependencyGlobalFeedbackKey = Symbol('global-feedback');