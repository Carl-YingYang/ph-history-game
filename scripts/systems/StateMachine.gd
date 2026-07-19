## StateMachine.gd — minimal, reusable Hierarchical-ish state machine.
##
## Usage: attach a StateMachine node as a child of the actor. Add State nodes
## (or script-driven states). The machine calls enter()/exit()/process()/physics_process()
## on the active state. States are identified by name (the node name).
extends Node
class_name StateMachine

var actor: Node = null            # the controlling node (player, npc, enemy)
var current: State = null
var states: Dictionary = {}       # name -> State

signal state_changed(from: String, to: String)


func _ready() -> void:
	for c in get_children():
		if c is State:
			states[c.name.to_lower()] = c
			c.machine = self
			c.actor = get_parent()
	if states.size() > 0:
		_transition_to(states.keys()[0])


func _process(delta: float) -> void:
	if current: current.process(delta)


func _physics_process(delta: float) -> void:
	if current: current.physics_process(delta)


func transition_to(state_name: String, ctx: Dictionary = {}) -> void:
	var key := state_name.to_lower()
	if not states.has(key):
		push_warning("StateMachine: unknown state %s" % state_name)
		return
	_transition_to(states[key], ctx)


func _transition_to(new_state: State, ctx: Dictionary = {}) -> void:
	if current:
		current.exit()
	var from := "" if current == null else current.name.to_lower()
	current = new_state
	current.enter(ctx)
	state_changed.emit(from, current.name.to_lower())
