## State.gd — base state for the StateMachine.
extends Node
class_name State

var machine: StateMachine = null
var actor: Node = null


func enter(_ctx: Dictionary = {}) -> void:
	pass


func exit() -> void:
	pass


func process(_delta: float) -> void:
	pass


func physics_process(_delta: float) -> void:
	pass


func transition(state_name: String, ctx: Dictionary = {}) -> void:
	machine.transition_to(state_name, ctx)
