/**
 * Truncate a string to the given length.
 *
 * @param string The string to truncate.
 * @param length The length to truncate by.
 *
 * @returns {string}
 */
export const truncateString = (string, length) => {
    return string.slice(0, length) + '...';
};

export const formatRant = (rant) => {

    return {
        color: '#f99a66',
        author_name: rant.user_username,
        image_url: rant.attached_image.url,
        title: truncateString(rant.text, 100),
        title_link: `https://www.devrant.io/rants/${rant.id}?ref=devrant-bot`,
        author_link: `https://www.devrant.io/users/${rant.user_username}?ref=devrant-bot`,
        fields: [
            {
                short: true,
                title: 'Score',
                value: rant.score
            },
            {
                short: true,
                title: 'Comments',
                value: rant.num_comments
            }
        ]
    };
};
