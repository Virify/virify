# Notifications Layer

This layer handles all user notification functionality including:

## Current Features
- **Count Badges**: Visual notification counts for favourites, notes, enquiries in navigation
- **Real-time Updates**: WebSocket-based aggregate count updates

## Future Features
- **Push Notifications**: Browser/mobile push notifications
- **Email Notifications**: Email alerts for important events  
- **In-app Notifications**: Notification bell/dropdown with history
- **Notification Preferences**: User settings for notification delivery
- **Real-time Alerts**: Toast/banner notifications for immediate feedback

## Architecture
- **Separation from Analytics**: Pure user notification functionality, separate from business analytics
- **Scalable Design**: Built to extend into a full notification system
- **Multi-channel Support**: Designed to support visual, push, email, and other notification types
