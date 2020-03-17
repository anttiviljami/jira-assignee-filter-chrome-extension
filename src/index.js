import { h } from 'dom-chef';
import $ from 'jquery';
import uniqBy from 'lodash/uniqBy';

const CONSOLE_PREFIX = '[ASSIGNEE_FILTER]';

const logger = {
  log: (...args) => console.log(CONSOLE_PREFIX, ...args),
  info: (...args) => console.info(CONSOLE_PREFIX, ...args),
  warn: (...args) => console.warn(CONSOLE_PREFIX, ...args),
  error: (...args) => console.error(CONSOLE_PREFIX, ...args),
};

let currentAssignee = null;

const filterToAssignee = async (name) => {
  // toggle assignee
  currentAssignee = currentAssignee === name ? null : name;
  console.log({ currentAssignee });

  // expand all swimlanes
  await $('#board-tools-section-button').click();
  await $('.js-view-action-expand-all').click();

  // clear highlights
  $('.assignee-avatar').removeClass('highlight');

  if (currentAssignee) {
    // hide all cards
    $('.ghx-issue').hide();

    // show only ones with correct assignee
    $(`.ghx-avatar img[alt="Assignee: ${currentAssignee}"]`).each((_, el) =>
      $(el)
        .closest('.ghx-issue')
        .show(),
    );

    // highlight filter
    $(`.assignee-avatar[data-name="${name}"]`).addClass('highlight');
  } else {
    console.log('clear filter');
    // clear filter
    $('.ghx-issue').show();
  }
};

const renderDropdown = (assignees) => {
  return (
    <ul id="assignee-filter">
      {assignees.map(({ name, img }) => (
        <li className="item" onClick={() => filterToAssignee(name)}>
          <div className="assignee-avatar" data-name={name}>
            <img alt={name} title={name} src={img} />
          </div>
        </li>
      ))}
    </ul>
  );
};

const getAllVisibleAssignees = () => {
  logger.info('Getting all assignees...');
  const avatars = [];
  $('.ghx-avatar img').each((_, el) => {
    const img = $(el).attr('src');
    const name = $(el)
      .attr('alt')
      .split(': ')[1];
    const avatar = {
      name,
      img,
    };
    avatars.push(avatar);
  });
  const assignees = uniqBy(avatars, 'name');
  logger.info(assignees);
  return assignees;
};

const init = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const assignees = getAllVisibleAssignees();
  const assigneeDropdown = renderDropdown(assignees);
  $('#ghx-header').append(assigneeDropdown);
};

$(window).ready(init);
