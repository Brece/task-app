import React from "react";

class Overview extends React.Component {
	render() {
		let tasks = this.props.tasks;
		return (
			<ul className="c-overview">
				{tasks.map((item) => {
					let id = item.id;

					return (
						<li key={id}>
							<p>Task #{tasks.indexOf(item) + 1}: {item.task}</p>
							<button type="button" data-id={id} onClick={ (e) => this.props.handleDelete(e.target.dataset.id) } className="c-btn c-btn__delete-one">Delete task</button>
            				<button type="button" data-id={id} onClick={ (e) => this.props.handleEdit(e.target.dataset.id)}className="c-btn c-btn__edit">Edit Task</button>
						</li>
					);
				})}
			</ul>
		)
	}
}

export { Overview }
