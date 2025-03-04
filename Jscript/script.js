// Form starts
$(document).ready(function(){
    $('#Contactform').on("submit", function(event) {
        event.preventDefault(); // Prevents form from submitting to a server

        var name = document.querySelector("#name").value;
        var email = document.querySelector("#email").value;
        var subject = document.querySelector("#subject").value;
        var message = document.querySelector("#message").value;

        var formDetails = `
        Name: ${name}
        Email: ${email} 
        Subject: ${subject}
        Message: ${message}`;
        
        alert(formDetails); // Aletrt faction for the Form
    }); //Form ends
});

$(document).ready(function() {
    // Check if dark mode is set in cookies
    const darkModeEnabled = Cookies.get('darkMode') === 'true';

    // Function to toggle dark mode
    function setDarkMode(isDarkMode) {
        $('body').toggleClass('dark-mode', isDarkMode);

        // Update aria-label for accessibility
        const button = $('#toggleButton');
        button.attr('aria-label', isDarkMode ? 'Disable dark mode' : 'Enable dark mode');

        // Toggle navbar, modal, and footer classes
        $('.navbar').toggleClass('navbar-light bg-light', !isDarkMode).toggleClass('navbar-dark bg-dark', isDarkMode);
        $('.modal-content').toggleClass('modal-dark', isDarkMode);
        $('footer').toggleClass('bg-light', !isDarkMode).toggleClass('bg-dark text-white', isDarkMode);

        // Save the user's dark mode preference
        Cookies.set('darkMode', isDarkMode, { expires: 7 });
    }

    // Initialize dark mode on page load
    setDarkMode(darkModeEnabled);

    // Toggle dark mode on button click
    $('#toggleButton').click(function() {
        const isDarkMode = !$('body').hasClass('dark-mode');
        setDarkMode(isDarkMode);
    });
});


// Task Management functionalities
$(document).ready(function() {
    // Function to load tasks from cookies
    function loadTasks() {
        const tasks = JSON.parse(Cookies.get('tasks') || '[]');
        tasks.forEach(task => {
            const taskRow = 
                `<tr class="task-row">
                    <td>${task.name}</td>
                    <td>${task.dueDate}</td>
                    <td>${task.description}</td>
                    <td class="status"><span class="badge badge-primary">${task.status}</span></td>
                    <td>
                        <button class="btn btn-primary action-button" data-toggle="modal" data-target="#taskModal">Actions</button>
                    </td>
                </tr>`;
            $('#task-list').append(taskRow);
        });
    }

    // Function to save tasks to cookies
    function saveTasks() {
        const tasks = [];
        $('.task-row').each(function() {
            const name = $(this).find('td:eq(0)').text();
            const dueDate = $(this).find('td:eq(1)').text();
            const description = $(this).find('td:eq(2)').text();
            const status = $(this).find('.status').text().trim();
            tasks.push({ name, description, dueDate, status });
        });
        Cookies.set('tasks', JSON.stringify(tasks), { expires: 30 }); // Set the cookie to expire in 30 days
    }

    // Load tasks on page load
    loadTasks(); // Load tasks from cookies when the page is loaded

    // Add Task
    $('#task-form').on('submit', function(e) {
        e.preventDefault();

        const taskName = $('#taskName').val();
        const taskDueDate = $('#taskDate').val();
        const taskDescription = $('#taskDescription').val();

        // Create the task row
        const taskRow = `
            <tr class="task-row">
                <td>${taskName}</td>
                <td>${taskDueDate}</td>
                <td>${taskDescription}</td>
                <td class="status"><span class="badge badge-primary ">Pending</span></td>
                <td>
                    <button class="btn btn-primary action-button" data-toggle="modal" data-target="#taskModal">Actions</button>
                </td>
            </tr>
        `;
        
        // Append the task row to the task list
        $('#task-list').append(taskRow);

        // Reset the form
        $('#task-form')[0].reset(); 

        // Save the updated task list to cookies
        saveTasks(); 
        logActivity(`Task "${taskName}" added.`);
    });

    $(document).on('click', '.action-button', function() {
        const row = $(this).closest('tr');
        $('#taskModal').data('row', row); // Store the row for later reference
    });

    // Filter Tasks
    $('#filterStatus').on('change', function() {
        const filterValue = $(this).val();
        $('.task-row').show(); // Show all initially

        if (filterValue === 'completed') {
            $('.task-row').filter(function() {
                return $(this).find('.status').text().trim() !== 'Completed';
            }).hide();
        } else if (filterValue === 'pending') {
            $('.task-row').filter(function() {
                return $(this).find('.status').text().trim() === 'Completed';
            }).hide();
        }
    });

    // Sort Tasks
    $('#sortTasks').on('change', function() {
        const sortBy = $(this).val();
        const rows = $('#task-list .task-row');

        rows.sort(function(a, b) {
            const aText = sortBy === 'name' ? $(a).find('td:eq(0)').text() : new Date($(a).find('td:eq(1)').text());
            const bText = sortBy === 'name' ? $(b).find('td:eq(0)').text() : new Date($(b).find('td:eq(1)').text());

            return aText > bText ? 1 : -1;
        });

        $('#task-list').empty().append(rows); // Append sorted rows back to the table
    });

    // Complete Task
    $(document).on('click', '.complete-task', function() {
        const row = $('#taskModal').data('row');
        row.find('.status').html('<span class="badge badge-success"> Completed</span>');
        $('#taskModal').modal('hide');
        saveTasks(); // Save updated tasks to cookies
        logActivity(`Task "${row.find('td:eq(0)').text()}" marked as completed.`);
    });

    // Edit Task
    $(document).on('click', '.edit-task', function() {
        const row = $('#taskModal').data('row');
        const taskName = row.find('td:eq(0)').text();

        $('#taskName').val(taskName);
        $('#taskDate').val(row.find('td:eq(1)').text());
        $('#taskDescription').val(row.find('td:eq(2)').text());
        row.remove();
        $('#taskModal').modal('hide');
        saveTasks(); // Save updated tasks to cookies
        logActivity(`Task "${taskName}" edited.`);
    });

    // Delete Task
    $(document).on('click', '.delete-task', function() {
        const row = $('#taskModal').data('row');
        const taskName = row.find('td:eq(0)').text();
        row.remove();
        $('#taskModal').modal('hide');
        saveTasks(); // Save updated tasks to cookies
        logActivity(`Task "${taskName}" deleted.`);
    });

    // Function to log activity
    function logActivity(activity) {
        const activities = JSON.parse(Cookies.get('activities') || '[]');
        activities.push({ activity, time: new Date().toLocaleString() });
        Cookies.set('activities', JSON.stringify(activities), { expires: 7 }); // Store activities in cookies
        loadLatestActivities(); // Update latest activities display
    }

    // Function to load latest activities
    function loadLatestActivities() {
        const activities = JSON.parse(Cookies.get('activities') || '[]');
        if (activities.length === 0) {
            $('#latest-activity-list').html('<h3 class=" text-center">No recent activities found.</h3>');
            return;
        }

        const latestActivities = activities.slice(-3); // Get the last 3 activities
        const activityList = latestActivities.map(activity => `
            <div class="alert alert-light">
                <strong>${activity.time}:</strong> ${activity.activity}
            </div>
        `).join('');

        $('#latest-activity-list').html(activityList); // Update the correct element
    }

    // Load latest tasks and activities on homepage
    loadLatestActivities(); // Call this function to populate the latest activities
});

$(document).ready(function() {
    // Listen for form submission
    $('#dietForm').on('submit', function(e) {
        e.preventDefault(); // Prevent the page from refreshing

        // Get the value from the textarea
        const comment = $('#dietBox').val();

        // Check if the comment is not empty
        if (comment.trim() !== '') {
            alert('Comment submitted: ' + comment);
            $('#dietForm')[0].reset(); // Reset the form after submission
        } else {
            alert('Please enter a comment.');
        }
    });
});