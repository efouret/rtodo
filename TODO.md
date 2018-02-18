# Requirements

* I want to be able to display the history of a task:
  * Date of completion
  * Date of creation
* I want to be able to remove a future occurrence of a repeatable task
* I want the tasks list to be sorted according to due date
* I want to be abel to edit a task:
  * Change the label
  * Change the due date
  * Change the repeat (frequency + from what)
  * Edit history
  * (Add history)

# Data model
A task:
~~~~
{
  "id": number,
  "name": string,
  "status": (TODO|DONE|DELETED),
  "dueDate": string (ISO-8601 datetime),
  "repeat": string,
  "repeatFrom": (completion|due),
  "history": [
    { /* previousXXX & newXXX are present only if different */
      "date": string (ISO-8601 datetime),
      "completionDate": string (ISO-8601 datetime),
      "previousName": string,
      "newName": string
      "previousStatus": (TODO|DONE|DELETED),
      "newStatus": (TODO|DONE|DELETED),
      "previousDueDate": string (ISO-8601 datetime),
      "newDueDate": string (ISO-8601 datetime),
      "previousRepeat": string,
      "newRepeat": string
    },
    ...
  ]

}
~~~~
