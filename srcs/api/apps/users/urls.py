from django.urls import path

from . import views

urlpatterns = [
    path('', views.ListUserView.as_view(), name='list_user'),
    path('me/', views.AuthUserView.as_view(), name='auth_user_view'),
    path('create/', views.SignUpView.as_view(), name='sign_up_view'),
    path('leaderboard/', views.LeaderBoardView.as_view(), name='leaderboard_view'),
    path('search/', views.UserSearchView.as_view(), name='user_search'),
]