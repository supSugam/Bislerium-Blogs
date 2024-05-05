import { IComment } from '../Interfaces/Models/IComment';

export const countTotalComments = (comments: IComment[]): number => {
  // Use reduce to iterate through each comment and its replies
  return comments.reduce((total, comment) => {
    // Increment count for the current comment
    total++;

    // If the comment has replies, recursively count each reply and add to total
    if (comment.replies.length > 0) {
      total += countTotalComments(comment.replies);
    }

    return total; // Return the updated total
  }, 0); // Start reduce with initial value 0
};
