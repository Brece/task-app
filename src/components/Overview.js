import React from "react";

class Overview extends React.Component {
	render() {
		let tasks = this.props.tasks;

		return (
			<ul className="c-overview">
				{tasks.map((task) => {
					let id = task.id;

					return (
						<li key={id}>
							<p>Task #{tasks.indexOf(task) + 1}: {task.input}</p>
							<button type="button" onClick={ () => this.props.handleDelete(id) } className="c-btn c-btn__delete-one">Delete task</button>
            				<button type="button" onClick={ () => this.props.handleEdit(id)}className="c-btn c-btn__edit">Edit Task</button>
						</li>
					);
				})}
			</ul>
		)
	}
}

export { Overview }
